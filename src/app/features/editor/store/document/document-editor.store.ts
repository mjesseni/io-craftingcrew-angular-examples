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
  AttributeInstance,
  AttributeType,
  AttributeTypeDefinition,
  AttributeValue,
  BlockAttributeDefinition,
  BlockInstance,
  DocumentDefinition,
  DocumentInstance,
  TableAttributeDefinition,
  TableInstance
} from '../../model/document.model';

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
    newValue: AttributeValue<AttributeType>;
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
      const currentId = draft.present.ui.focusedAttribute;
      const index = flat.findIndex(a => a.uuid === currentId);

      if (index === flat.length - 1) {
        updateFocusState(draft.present, flat[0]?.uuid);
      } else {
        const next = flat[Math.min(index + 1, flat.length - 1)];
        updateFocusState(draft.present, next?.uuid);
      }
    })
  );

  readonly focusPrevious = this.updater(state =>
    produce(state, draft => {
      const flat = this.flattenedAttributes$();
      const currentId = draft.present.ui.focusedAttribute;
      const index = flat.findIndex(a => a.uuid === currentId);
      const prev = flat[Math.max(index - 1, 0)];
      updateFocusState(draft.present, prev?.uuid);
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
      if (attr.type === AttributeType.BLOCK) {
        this.flattenAttributes((attr as AttributeInstance<AttributeType.BLOCK>).value.attributes, result);
      } else if (attr.type === AttributeType.TABLE) {
        for (const row of (attr as AttributeInstance<AttributeType.TABLE>).value.rows) {
          this.flattenAttributes(row.columns, result);
        }
      } else {
        result.push(attr);
      }
    }
    return result;
  }

  private flattenAttributeDefinitions(definitions: AttributeTypeDefinition[], map = new Map<string, AttributeTypeDefinition>()): Map<string, AttributeTypeDefinition> {
    for (const def of definitions) {
      map.set(def.uuid, def);
      if (def.type === AttributeType.BLOCK) {
        this.flattenAttributeDefinitions((def as BlockAttributeDefinition).children, map);
      } else if (def.type === AttributeType.TABLE) {
        const table = def as TableAttributeDefinition;
        for (const column of table.columns) {
          map.set(column.uuid, column);
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
      if (attr.uuid == attributeId) {
        return attr;
      }

      if (attr.type === AttributeType.BLOCK) {
        const nested = this.findAttributeById((attr.value as BlockInstance).attributes, attributeId);
        if (nested) return nested;
      }

      if (attr.type === AttributeType.TABLE) {
        const rows = (attr.value as TableInstance).rows;
        for (const row of rows) {
          const nested = this.findAttributeById(row.columns, attributeId);
          if (nested) return nested;
        }
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
    state.attributeStates[newId] ??= {
      ...DEFAULT_ATTRIBUTE_STATE,
      transient: {focused: false, loading: false}
    };
    state.attributeStates[newId].transient!.focused = true;
    state.ui.focusedAttribute = newId;
  } else {
    state.ui.focusedAttribute = undefined;
  }
}
