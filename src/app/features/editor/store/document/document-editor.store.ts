import { computed, Injectable, Signal } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { produce } from 'immer';
import {
  AttributeEditorState,
  DocumentEditorHistoryState,
  DocumentEditorState,
  DocumentEditorStatus
} from './document.state';

import {
  AttributeDefinition,
  AttributeInstance,
  AttributeType,
  AttributeTypeDefinition,
  AttributeValue,
  BlockAttributeDefinition,
  BlockInstance,
  DocumentDefinition,
  DocumentInstance,
  TableAttributeDefinition
} from '../../model/document.model';
import { getBlockInstances } from './document-utils';

const DEFAULT_ATTRIBUTE_STATE: AttributeEditorState = {
  visible: true,
  editable: true,
  dirty: false,
  valid: true,
  transient: {
    focused: false,
    loading: false
  }
};

const INITIAL_STATE: DocumentEditorState = {
  present: {
    document: {definitionUuid: '', attributes: []},
    definition: {uuid: '', name: '', attributes: []},
    attributeStates: {},
    validationSummary: {isValid: true, errors: []},
    dirty: false,
    ui: {expandedBlocks: new Set(), focusedAttribute: undefined}
  },
  past: [],
  future: [],
  status: 'idle'
};

@Injectable()
export class DocumentEditorStore extends ComponentStore<DocumentEditorState> {
  private readonly attributeStateCache = new Map<string, Signal<AttributeEditorState>>();

  constructor() {
    super(structuredClone(INITIAL_STATE));
  }

  // === Signals ===

  readonly present$ = this.selectSignal(s => s.present);
  readonly document$ = this.selectSignal(s => s.present.document);
  readonly definition$ = this.selectSignal(s => s.present.definition);
  readonly attributes$ = this.selectSignal(s => s.present.document.attributes);
  readonly status$ = this.selectSignal(s => s.status);
  readonly dirty$ = this.selectSignal(s => s.present.dirty);
  readonly validation$ = this.selectSignal(s => s.present.validationSummary);
  readonly focusedAttribute$ = this.selectSignal(s => s.present.ui.focusedAttribute);
  readonly flattenedAttributes$ = computed(() => this.flattenAttributes(this.document$().attributes));
  readonly flattenedAttributeDefs$ = computed(() => this.flattenAttributeDefinitions(this.definition$().attributes));

  readonly attributeState$ = (id: string): Signal<AttributeEditorState> => {
    if (!this.attributeStateCache.has(id)) {
      this.attributeStateCache.set(
        id,
        this.selectSignal(s => s.present.attributeStates[id] ?? DEFAULT_ATTRIBUTE_STATE)
      );
    }
    return this.attributeStateCache.get(id)!;
  };

  readonly getAttributeById$ = (id: string): Signal<AttributeInstance | undefined> =>
    computed(() => this.flattenedAttributes$().find(attr => attr.uuid === id));
  readonly getAttributeDefById$ = (id: string): Signal<AttributeTypeDefinition> =>
    computed(() => this.flattenedAttributeDefs$().get(id)!);


  // === Updaters ===

  readonly focusAttribute = this.updater((state, attributeId: string) => {
      if (attributeId === state.present.ui.focusedAttribute) {
        return state;
      }
      return produce(state, draft => {
        this.blurAttribute(draft);
        this.initAttributeStates(draft.present, attributeId);
        draft.present.attributeStates[attributeId]!.transient!.focused = true;
        draft.present.ui.focusedAttribute = attributeId;
      });
    }
  );

  readonly updateAttributeValue = this.updater((state, {attributeId, newValue}: {
    attributeId: string;
    newValue: AttributeValue<AttributeType>
  }) => {
    const snapshot = structuredClone(state.present);
    updateFocusState(snapshot, attributeId);

    return produce(state, draft => {
      draft.past.push(snapshot);
      draft.future = [];

      const attr = this.findAttributeById(draft.present.document.attributes, attributeId);
      if (attr) {
        attr.value = newValue;
      }

      this.initAttributeStates(draft.present, attributeId);
      draft.present.attributeStates[attributeId]!.dirty = true;
      draft.present.dirty = true;
    });
  });

  readonly undo = this.updater(state => {
    if (state.past.length === 0) return state;
    return {
      ...state,
      future: [structuredClone(state.present), ...state.future],
      present: state.past[state.past.length - 1],
      past: state.past.slice(0, -1)
    };
  });

  readonly redo = this.updater(state => {
    if (state.future.length === 0) return state;
    return {
      ...state,
      past: [...state.past, structuredClone(state.present)],
      present: state.future[0],
      future: state.future.slice(1)
    };
  });

  readonly setStatus = this.updater((state, status: DocumentEditorStatus) => ({
    ...state,
    status
  }));

  readonly loadDocument =
    this.updater((state, payload: { document: DocumentInstance; definition: DocumentDefinition }) => {
      this.resetCaches();
      const newState = structuredClone({
        ...state,
        past: [],
        future: [],
        present: {
          document: payload.document,
          definition: payload.definition,
          attributeStates: {},
          validationSummary: {isValid: true, errors: []},
          dirty: false,
          ui: {expandedBlocks: new Set(), focusedAttribute: undefined}
        }
      }) as DocumentEditorState;

      const firstId = this.flattenAttributes(payload.document.attributes)[0]?.uuid;
      updateFocusState(newState.present, firstId);

      return newState;
    });

  readonly reset = this.updater(() => structuredClone(INITIAL_STATE));

  readonly focusNext = this.updater(state =>
    produce(state, draft => {
      const flat = this.flattenedAttributes$();
      const defs = this.flattenedAttributeDefs$();
      const currentId = draft.present.ui.focusedAttribute;

      const nextId = this.findNextFocusableAttribute(flat, defs, currentId, 'forward');
      updateFocusState(draft.present, nextId);
    })
  );


  readonly focusPrevious = this.updater(state =>
    produce(state, draft => {
      const flat = this.flattenedAttributes$();
      const defs = this.flattenedAttributeDefs$();
      const currentId = draft.present.ui.focusedAttribute;

      const prevId = this.findNextFocusableAttribute(flat, defs, currentId, 'backward');
      updateFocusState(draft.present, prevId);
    })
  );

  readonly clearFocus = this.updater(state =>
    produce(state, draft => {
      updateFocusState(draft.present, undefined);
    })
  );

  // === Helpers ===

  private blurAttribute(draft: DocumentEditorState) {
    const prev = draft.present.ui.focusedAttribute;
    if (prev && draft.present.attributeStates[prev]) {
      draft.present.attributeStates[prev]!.transient ??= {};
      draft.present.attributeStates[prev]!.transient!.focused = false;
    }
  }

  private initAttributeStates(present: DocumentEditorHistoryState, attributeId: string) {
    present.attributeStates[attributeId] ??= {
      ...DEFAULT_ATTRIBUTE_STATE,
      transient: {focused: false, loading: false}
    };
  }

  private resetCaches() {
    this.attributeStateCache.clear();
  }

  private flattenAttributes(attributes: AttributeInstance[], result: AttributeInstance[] = []): AttributeInstance[] {
    for (const attr of attributes) {
      switch (attr.type) {
        case AttributeType.BLOCK: {
          const blocks = this.getBlockInstances(attr);
          for (const b of blocks) {
            this.flattenAttributes(b.attributes, result);
          }
          break;
        }
        case AttributeType.TABLE: {
          const table = attr as AttributeInstance<AttributeType.TABLE>;
          for (const row of table.value.rows) {
            this.flattenAttributes(row.columns, result);
          }
          break;
        }
        default:
          result.push(attr);
      }
    }
    return result;
  }


  private getBlockInstances(attr: AttributeInstance): BlockInstance[] {
    const block = attr as AttributeInstance<AttributeType.BLOCK>;
    const def = this.flattenedAttributeDefs$().get(block.definitionId) as BlockAttributeDefinition | undefined;
    return def ? getBlockInstances(attr, def) : [];
  }

  private flattenAttributeDefinitions(definitions: AttributeTypeDefinition[], map = new Map<string, AttributeTypeDefinition>()): Map<string, AttributeTypeDefinition> {
    for (const def of definitions) {
      map.set(def.uuid, def);

      switch (def.type) {
        case AttributeType.BLOCK: {
          const block = def as BlockAttributeDefinition;
          this.flattenAttributeDefinitions(block.children, map);
          break;
        }
        case AttributeType.TABLE: {
          const table = def as TableAttributeDefinition;
          for (const column of table.columns) {
            map.set(column.uuid, column);
          }
          break;
        }
      }
    }

    return map;
  }


  /**
   * Recursively searches for an attribute instance by ID in the given attribute list.
   */
  private findAttributeById(attributes: AttributeInstance[], attributeId: string): AttributeInstance | undefined {
    for (const attr of attributes) {
      if (attr.uuid === attributeId) {
        return attr;
      }

      switch (attr.type) {
        case AttributeType.BLOCK: {
          const blocks = this.getBlockInstances(attr);
          for (const b of blocks) {
            const nested = this.findAttributeById(b.attributes, attributeId);
            if (nested) return nested;
          }
          break;
        }

        case AttributeType.TABLE: {
          const table = attr as AttributeInstance<AttributeType.TABLE>;
          for (const row of table.value.rows) {
            const nested = this.findAttributeById(row.columns, attributeId);
            if (nested) return nested;
          }
          break;
        }
      }
    }

    return undefined;
  }


  /**
   * Finds the next focusable attribute's uuid.
   *
   * This method searches through a flattened list of attribute instances starting from the current focus position (or
   * beginning/end based on the direction) and returns the uuid of the first attribute that is not read-only or
   * immutable.
   *
   * @param flat - The flattened list of attribute instances.
   * @param defs - A map of attribute definitions keyed by their uuid.
   * @param currentId - The uuid of the currently focused attribute, if any.
   * @param direction - The focus traversal direction, either 'forward' or 'backward'.
   * @returns The uuid of the next focusable attribute, or undefined if none found.
   */
  private findNextFocusableAttribute(flat: AttributeInstance[], defs: Map<string, AttributeDefinition>,
                                     currentId: string | undefined, direction: 'forward' | 'backward'): string | undefined {
    const currentIndex = flat.findIndex(a => a.uuid === currentId);
    const length = flat.length;
    const indexRange = direction === 'forward'
      ? [...Array(length).keys()].slice(currentIndex + 1).concat([...Array(currentIndex + 1).keys()])
      : [...Array(length).keys()].slice(0, currentIndex).reverse().concat([...Array(length).keys()].slice(currentIndex).reverse());

    for (const i of indexRange) {
      const candidate = flat[i];
      const def = defs.get(candidate.definitionId);
      if (def && !def.readOnly && !def.immutable) {
        return candidate.uuid;
      }
    }
    return undefined;
  }
}

function updateFocusState(state: DocumentEditorHistoryState, newId?: string) {
  const prevId = state.ui.focusedAttribute;
  if (prevId && state.attributeStates[prevId]) {
    state.attributeStates[prevId].transient ??= {};
    state.attributeStates[prevId].transient!.focused = false;
  }

  if (newId) {
    state.attributeStates[newId] ??= {...DEFAULT_ATTRIBUTE_STATE, transient: {focused: false, loading: false}};
    state.attributeStates[newId].transient!.focused = true;
    state.ui.focusedAttribute = newId;
  } else {
    state.ui.focusedAttribute = undefined;
  }
}
