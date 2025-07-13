import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';
import { AttributeEditorState, DocumentEditorState } from './document.state';
import {
  blurAttribute,
  clearDirty,
  collapseBlock,
  expandBlock,
  focusAttribute,
  loadDocumentInstance,
  markDirty,
  redo,
  resetEditor,
  setEditorStatus,
  setValidationSummary,
  undo,
  updateAttributeValue
} from './document.actions';
import { findAttributeById } from './document.utils';

/**
 * Initial state for the document editor.
 * Represents a clean editor with no loaded document.
 */
export const initialDocumentEditorState: DocumentEditorState = {
  present: {
    document: {
      definitionUuid: '',
      attributes: []
    },
    attributeStates: {},
    validationSummary: {
      isValid: true,
      errors: []
    },
    dirty: false,
    ui: {
      expandedBlocks: new Set(),
      focusedAttribute: undefined
    }
  },
  past: [],
  future: [],
  status: 'idle'
};

export const DEFAULT_ATTRIBUTE_EDITOR_STATE = {
  visible: true,
  editable: true,
  dirty: false,
  valid: true
} satisfies AttributeEditorState;

/**
 * This reducer uses Immer (`produce`) to simplify immutable state updates. Immer allows writing state mutations in
 * a mutable style, but under the hood, it produces a new immutable state by only copying the parts that changed.
 *
 * Benefits:
 * - Cleaner and more readable reducer logic
 * - Structural sharing for unchanged parts (optimized performance)
 * - Ideal for complex nested structures like forms and editors
 */
export const documentEditorReducer = createReducer(
  initialDocumentEditorState,

  /**
   * Focuses an attribute (e.g., scrolls into view or highlights it).
   */
  on(focusAttribute, (state, {attributeId}) =>
    produce(state, draft => {
      draft.present.ui.focusedAttribute = attributeId;
    })
  ),

  /**
   * Blurs an attribute (e.g., removes visual focus).
   */
  on(blurAttribute, (state, {attributeId}) =>
    produce(state, draft => {
      if (draft.present.ui.focusedAttribute === attributeId) {
        draft.present.ui.focusedAttribute = undefined;
      }
    })
  ),

  /**
   * Updates the value of an attribute, supporting nested attributes in blocks or tables.
   * Also marks the attribute and the document as dirty and pushes the current state to the undo stack.
   */
  on(updateAttributeValue(), (state, {attributeId, newValue}) => {
      const present = structuredClone(state.present);
      return produce(state, draft => {
        // Save the current state for undo support
        draft.past.push(present);
        draft.future = []; // Clear redo stack

        // Find and update the attribute by ID (supports nested blocks/tables)
        const attr = findAttributeById(draft.present.document.attributes, attributeId);
        if (attr) {
          attr.value = newValue;
        }

        // Ensure attribute state exists and mark as dirty
        draft.present.attributeStates[attributeId] ??= {...DEFAULT_ATTRIBUTE_EDITOR_STATE};
        draft.present.attributeStates[attributeId]!.dirty = true;
        draft.present.dirty = true;
      });
    }
  ),

  /**
   * Restores the last editor state from the undo stack.
   * Pushes the current state to the redo stack.
   */
  on(undo, state => {
      const present = structuredClone(state.present);
      return produce(state, draft => {
        if (draft.past.length > 0) {
          draft.future.unshift(present);
          draft.present = draft.past.pop()!;
        }
      });
    }
  ),

  /**
   * Reapplies a previously undone change from the redo stack.
   */
  on(redo, state => {
      const present = structuredClone(state.present);
      return produce(state, draft => {
        if (draft.future.length > 0) {
          draft.past.push(present);
          draft.present = draft.future.shift()!;
        }
      });
    }
  ),

  /**
   * Marks a specific attribute as dirty.
   */
  on(markDirty, (state, {attributeId}) =>
    produce(state, draft => {
      draft.present.attributeStates[attributeId] ??= {...DEFAULT_ATTRIBUTE_EDITOR_STATE}
      draft.present.attributeStates[attributeId]!.dirty = true;
      draft.present.dirty = true;
    })
  ),

  /**
   * Clears the dirty flag for a specific attribute.
   */
  on(clearDirty, (state, {attributeId}) =>
    produce(state, draft => {
      if (draft.present.attributeStates[attributeId]) {
        draft.present.attributeStates[attributeId]!.dirty = false;
      }
    })
  ),

  /**
   * Sets the high-level editor lifecycle status.
   */
  on(setEditorStatus, (state, {status}) =>
    produce(state, draft => {
      draft.status = status;
    })
  ),

  /**
   * Replaces the global validation summary for the document.
   */
  on(setValidationSummary, (state, {isValid, errors}) =>
    produce(state, draft => {
      draft.present.validationSummary = {isValid, errors};
    })
  ),

  /**
   * Expands a block in the UI (e.g., shows nested attributes).
   */
  on(expandBlock, (state, {blockId}) =>
    produce(state, draft => {
      draft.present.ui.expandedBlocks.add(blockId);
    })
  ),

  /**
   * Collapses a block in the UI (e.g., hides nested attributes).
   */
  on(collapseBlock, (state, {blockId}) =>
    produce(state, draft => {
      draft.present.ui.expandedBlocks.delete(blockId);
    })
  ),

  /**
   * Loads a new document into the editor and resets all UI and validation state.
   * This also clears the undo/redo stacks.
   */
  on(loadDocumentInstance, (state, {document}) =>
    produce(state, draft => {
      draft.past = [];
      draft.future = [];
      draft.present.document = document;
      draft.present.attributeStates = {};
      draft.present.validationSummary = {isValid: true, errors: []};
      draft.present.ui = {expandedBlocks: new Set(), focusedAttribute: undefined};
      draft.present.dirty = false;
    })
  ),

  /**
   * Resets the entire editor to the initial clean state.
   */
  on(resetEditor, () => structuredClone(initialDocumentEditorState))
);
