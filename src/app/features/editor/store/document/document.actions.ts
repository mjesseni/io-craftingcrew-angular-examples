import { createAction, props } from '@ngrx/store';
import { AttributeType, AttributeValue, DocumentInstance } from '../../model/document.model';
import { ValidationError } from './document.state';

/**
 * Feature key for the Document Editor module.
 */
export const DOCUMENT_EDITOR_FEATURE = '[Document Editor]';

/**
 * Focuses a specific attribute in the editor (e.g., for scroll or highlighting).
 */
export const focusAttribute = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Focus Attribute`,
  props<{ attributeId: string }>()
);

/**
 * Removes focus from a specific attribute in the editor.
 */
export const blurAttribute = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Blur Attribute`,
  props<{ attributeId: string }>()
);

/**
 * Updates the value of a single attribute.
 * Supports primitive and structured types depending on the attribute definition.
 */
export const updateAttributeValue = () =>
  createAction(
    `${DOCUMENT_EDITOR_FEATURE} Update Attribute Value`,
    props<{
      attributeId: string;
      attributeType: AttributeType;
      newValue: AttributeValue<AttributeType>;
    }>()
  );

/**
 * Reverts the last change to the document instance.
 * Undo is maintained as part of the document history state.
 */
export const undo = createAction(`${DOCUMENT_EDITOR_FEATURE} Undo`);

/**
 * Re-applies the last undone change to the document instance.
 */
export const redo = createAction(`${DOCUMENT_EDITOR_FEATURE} Redo`);

/**
 * Marks a specific attribute as dirty (i.e., user has changed the value).
 */
export const markDirty = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Mark Dirty`,
  props<{ attributeId: string }>()
);

/**
 * Clears the dirty flag for a specific attribute.
 */
export const clearDirty = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Clear Dirty`,
  props<{ attributeId: string }>()
);

/**
 * Sets the overall status of the editor, e.g. for UI transitions or workflow states.
 *
 * - `idle`: No active changes.
 * - `editing`: User is modifying fields.
 * - `saving`: Save in progress.
 * - `error`: A critical validation or save error occurred.
 * - `completed`: Save finished successfully.
 */
export const setEditorStatus = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Set Status`,
  props<{ status: 'idle' | 'editing' | 'saving' | 'error' | 'completed' }>()
);

/**
 * Updates the global validation result for the entire document.
 * Used to show a validation summary and highlight invalid fields.
 */
export const setValidationSummary = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Set Validation Summary`,
  props<{
    isValid: boolean;
    errors: ValidationError[];
  }>()
);

/**
 * Expands a block in the UI (e.g., reveals child attributes).
 */
export const expandBlock = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Expand Block`,
  props<{ blockId: string }>()
);

/**
 * Collapses a block in the UI (e.g., hides child attributes).
 */
export const collapseBlock = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Collapse Block`,
  props<{ blockId: string }>()
);

/**
 * Loads a new document instance into the editor for editing.
 */
export const loadDocumentInstance = createAction(
  `${DOCUMENT_EDITOR_FEATURE} Load Document`,
  props<{ document: DocumentInstance }>()
);

/**
 * Resets the editor to an initial clean state.
 * Useful when switching between documents or clearing the form.
 */
export const resetEditor = createAction(`${DOCUMENT_EDITOR_FEATURE} Reset`);
