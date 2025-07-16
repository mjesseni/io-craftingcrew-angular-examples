import { ConstraintType, DocumentDefinition, DocumentInstance } from '../../model/document.model';

/**
 * A validation error for a specific attribute.
 */
export interface ValidationError {
  /** The technical name of the attribute this error is associated with. */
  attributeId: string;

  /** A user-facing error message (can be localized). */
  message: string;

  /** Optional constraint type that triggered this error. */
  constraintType?: ConstraintType;
}

/**
 * Validation summary for the entire document.
 */
export interface ValidationSummary {
  /** Indicates whether the document is currently valid. */
  isValid: boolean;

  /** Aggregated list of all validation errors. */
  errors: ValidationError[];
}

/**
 * UI and validation state for a single attribute.
 */
export interface AttributeEditorState {
  /** Whether the attribute is currently visible. */
  visible: boolean;

  /** Whether the attribute is currently editable. */
  editable: boolean;

  /** Whether the user has modified the attribute. */
  dirty: boolean;

  /** Whether the attribute's current value is valid. */
  valid: boolean;

  /** Optional list of validation errors. */
  errors?: ValidationError[];

  /** Transient UI state (e.g., focus, loading) */
  transient?: {
    focused?: boolean;
    loading?: boolean;
  };
}

/**
 * UI-specific state such as expanded blocks and focus.
 */
export interface DocumentUIState {
  /** Block names currently expanded in the UI. */
  expandedBlocks: Set<string>;

  /** Currently focused attribute (technical name). */
  focusedAttribute?: string;
}

/**
 * A full snapshot of the document and its associated editor state.
 * Used for undo/redo and historical tracking.
 */
export interface DocumentEditorHistoryState {
  /** Document data at a point in time. */
  document: DocumentInstance;

  /** Metadata about the document structure and attributes. */
  definition: DocumentDefinition;

  /** Attribute-specific metadata such as visibility and validation. */
  attributeStates: Partial<Record<string, AttributeEditorState>>;

  /** Global validation summary. */
  validationSummary: ValidationSummary;

  /** Dirty flag for unsaved changes. */
  dirty: boolean;

  /** UI state snapshot. */
  ui: DocumentUIState;
}

/**
 * High-level lifecycle status of the editor.
 */
export type DocumentEditorStatus = 'idle' | 'editing' | 'saving' | 'error' | 'completed';

/**
 * Root state object for a metadata-driven document editor.
 * Supports runtime editing, validation, undo/redo, and UI metadata.
 */
export interface DocumentEditorState {
  /**
   * The current working snapshot of the editor state.
   * All user changes are reflected here.
   */
  present: DocumentEditorHistoryState;

  /**
   * A stack of past states (for undo support).
   */
  past: DocumentEditorHistoryState[];

  /**
   * A stack of future states (for redo support).
   */
  future: DocumentEditorHistoryState[];

  /**
   * Overall lifecycle status (e.g., saving, editing, error).
   */
  status: DocumentEditorStatus;
}
