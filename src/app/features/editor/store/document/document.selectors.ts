import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentEditorState } from './document.state';
import { findAttributeById } from './document.utils';

/**
 * Feature selector for the Document Editor state.
 *
 * Used as the root entry point for all selectors related to document editing,
 * including form state, UI metadata, and validation.
 */
export const selectDocumentEditorState =
  createFeatureSelector<DocumentEditorState>('editor.document');

/**
 * Selects the current editable snapshot ("present") of the editor.
 *
 * This includes the actual document data, UI state, validation summary, etc.
 */
export const selectPresent = createSelector(
  selectDocumentEditorState,
  state => state.present
);

/**
 * Selects the currently loaded DocumentInstance being edited.
 *
 * This contains all top-level attributes, which may include nested structures.
 */
export const selectDocument = createSelector(
  selectPresent,
  present => present.document
);

/**
 * Selects the list of top-level attributes in the current document.
 *
 * These may include nested attributes via BLOCKs and TABLEs.
 */
export const selectAttributes = createSelector(
  selectDocument,
  document => document.attributes
);

/**
 * Selects the attributeStates mapping from the editor.
 *
 * This holds visibility, dirty flags, and validation status per attribute.
 */
export const selectAttributeStates = createSelector(
  selectPresent,
  present => present.attributeStates
);

/**
 * Selects the validation summary for the current document.
 */
export const selectDocumentDirty = createSelector(
  selectPresent,
  present => present.dirty
);

/**
 * Recursively retrieves an attribute (by ID) from the document attribute tree.
 *
 * Supports nested lookup through blocks and tables.
 *
 * @param attributeId Technical ID (usually UUID) of the attribute.
 */
export const selectAttributeById = (attributeId: string) => createSelector(
  selectAttributes,
  attributes => findAttributeById(attributes, attributeId)
);

/**
 * Selects the editor-specific metadata (e.g., visibility, validity) for an attribute.
 *
 * @param attributeId Technical ID of the attribute.
 */
export const selectAttributeState = (attributeId: string) => createSelector(
  selectAttributeStates,
  stateMap => stateMap[attributeId]
);

/**
 * Determines if an attribute is currently visible in the UI.
 *
 * Returns true by default if visibility is not explicitly set.
 */
export const selectIsAttributeVisible = (attributeId: string) => createSelector(
  selectAttributeState(attributeId),
  state => state?.visible ?? true
);

/**
 * Determines if the attribute's value is currently valid.
 *
 * Returns true by default if no validation has been performed yet.
 */
export const selectIsAttributeValid = (attributeId: string) => createSelector(
  selectAttributeState(attributeId),
  state => state?.valid ?? true
);

/**
 * Determines if the attribute has been modified by the user.
 *
 * Useful for highlighting or tracking unsaved changes.
 */
export const selectIsAttributeDirty = (attributeId: string) => createSelector(
  selectAttributeState(attributeId),
  state => state?.dirty ?? false
);

/**
 * Returns true if the given attribute is currently focused in the UI.
 */
export const selectIsAttributeFocused = (attributeId: string) => createSelector(
  selectPresent,
  present => present.ui.focusedAttribute === attributeId
);

/**
 * Retrieves the attribute ID that is currently focused in the UI.
 *
 * Can be used for scrolling or keyboard navigation logic.
 */
export const selectFocusedAttributeId = createSelector(
  selectPresent,
  present => present.ui.focusedAttribute
);

/**
 * Returns the currently focused attribute object, if any.
 *
 * Uses the recursive lookup function to resolve the actual attribute instance.
 */
export const selectFocusedAttribute = createSelector(
  selectAttributes,
  selectFocusedAttributeId,
  (attributes, id) => id ? findAttributeById(attributes, id) : undefined
);

/**
 * Returns true if the given block is expanded in the UI.
 *
 * Used to control collapsible block rendering.
 */
export const selectIsBlockExpanded = (blockId: string) => createSelector(
  selectPresent,
  present => present.ui.expandedBlocks.has(blockId)
);
