/**
 * Optional localization metadata for translatable content.
 */
interface LocalizedText {
  text: string;
  i18nKey?: string;
}

/**
 * Represents a translatable string.
 * It can be either a plain string or a LocalizedText object containing localization metadata.
 */
export type TranslatableString = string | LocalizedText;

/**
 * Defines the supported types of attributes used for metadata-driven forms,
 * data models, or dynamic UI components.
 */
export enum AttributeType {
  /**
   * A container block that groups other attributes, typically used for layout or structure.
   */
  BLOCK = 'block',

  /**
   * A tabular structure allowing entry of multiple rows of repeated fields.
   * Suitable for line items, lists, or detail records.
   */
  TABLE = 'table',

  /**
   * A selectable value from a predefined list (e.g., dropdown or typeahead).
   */
  PICKLIST = 'picklist',

  /**
   * A true/false or yes/no value.
   */
  BOOLEAN = 'boolean',

  /**
   * A short free-form text input, usually a single line.
   */
  STRING = 'string',

  /**
   * A longer multi-line text input, suitable for descriptions or comments.
   */
  TEXT = 'text',

  /**
   * A numeric input, such as integer, float, or decimal.
   */
  NUMERIC = 'numeric',

  /**
   * A value paired with a unit of measurement (e.g., "5 kg", "20 cm").
   */
  UNIT = 'unit',

  /**
   * A date value, typically represented as a calendar date.
   */
  DATE = 'date',

  /**
   * A file or document that can be uploaded as an attachment.
   */
  ATTACHMENT = 'attachment',

  /**
   * A reference to another document or entity (e.g., by ID or link).
   */
  DOCUMENT_REFERENCE = 'docRef'
}

/**
 * Enum representing the different types of constraints that can be applied
 * to a field or property in validation logic or schema definition.
 */
export enum ConstraintType {
  /**
   * Ensures that the value is not null or undefined.
   * Typically used to enforce required fields.
   */
  NOT_NULL = 'notNull',

  /**
   * Ensures that the value is unique across a dataset.
   * Commonly used in database constraints or user input validation (e.g., unique email).
   */
  UNIQUE = 'unique',

  /**
   * Enforces a minimum length on string values.
   * Useful for text input fields such as passwords or usernames.
   */
  MIN_LENGTH = 'minLength',

  /**
   * Enforces a maximum length on string values.
   * Useful for limiting input sizes to avoid overflow or database limits.
   */
  MAX_LENGTH = 'maxLength',

  /**
   * Ensures the value matches a specified regular expression pattern.
   * Ideal for validating formats such as email addresses, phone numbers, or custom formats.
   */
  REGEX = 'regex',

  /**
   * Ensures the value falls within a specified numeric or date range.
   * Applicable to age, date selections, prices, etc.
   */
  RANGE = 'range',

  /**
   * Restricts the value to one of a predefined set of valid options.
   * Useful for dropdowns, enums, or categorical inputs.
   */
  ENUM = 'enum',

  /**
   * Represents a user-defined or application-specific constraint.
   * Enables implementation of custom validation logic not covered by standard constraints.
   */
  CUSTOM = 'custom'
}

/**
 * Defines the source of a user-provided value in a metadata-driven system.
 *
 * This discriminator helps distinguish between values that come from a
 * predefined list of options versus those entered freely by the user.
 *
 * It enables clear handling of UI logic, validation, serialization,
 * and auditability across various attribute types (e.g., PICKLIST, UNIT).
 */
export enum ValueSourceType {
  /**
   * The value was selected from a predefined set of available options.
   *
   * This typically means the value corresponds to one of the configured `Option` entries
   * and can be safely interpreted using the associated label or metadata.
   */
  OPTION = 'option',

  /**
   * The value was freely entered by the user and does not match any predefined options.
   *
   * This allows for flexible input, especially in cases where a user needs to
   * override or extend the available choices (e.g., entering a custom tag, label, or reference).
   */
  CUSTOM = 'custom'
}


/**
 * Maps each AttributeType to its corresponding valid value type.
 */
export interface AttributeValueTypeMap {
  [AttributeType.BOOLEAN]: boolean;
  [AttributeType.STRING]: string;
  [AttributeType.TEXT]: string;
  [AttributeType.NUMERIC]: number;
  [AttributeType.UNIT]:
    | { value: number; unit: { type: ValueSourceType.OPTION; value: Option } }
    | { value: number; unit: { type: ValueSourceType.CUSTOM; value: string } };
  [AttributeType.DATE]: Date;
  [AttributeType.PICKLIST]:
    | { type: ValueSourceType.OPTION; value: Option }
    | { type: ValueSourceType.CUSTOM; value: string };
  [AttributeType.TABLE]: never;     // structural, not value-carrying
  [AttributeType.BLOCK]: never;     // structural, not value-carrying
  [AttributeType.ATTACHMENT]: File | string; // base64 or URL
  [AttributeType.DOCUMENT_REFERENCE]: string;
}

/**
 * Extracts the correct value type for a given AttributeType.
 */
export type AttributeValue<T extends AttributeType> =
  AttributeValueTypeMap[T];

/**
 * Represents a single validation or business rule constraint for an attribute.
 */
export type Constraint =
  | { type: ConstraintType.NOT_NULL; message?: string }
  | { type: ConstraintType.UNIQUE; message?: string }
  | { type: ConstraintType.MIN_LENGTH; parameters: { minLength: number }; message?: string }
  | { type: ConstraintType.MAX_LENGTH; parameters: { maxLength: number }; message?: string }
  | { type: ConstraintType.REGEX; parameters: { regex: string }; message?: string }
  | { type: ConstraintType.RANGE; parameters: { range: { min: number; max: number } }; message?: string }
  | { type: ConstraintType.ENUM; parameters: { enum: string[] }; message?: string }
  | { type: ConstraintType.CUSTOM; parameters: { customCode: string }; message?: string };

/**
 * Defines a selectable option for picklists or enum-like fields.
 */
export interface Option {
  /**
   * The stored value of the option.
   */
  value: string;

  /**
   * The label displayed to the user.
   */
  label: TranslatableString;

  /**
   * Optional description or tooltip for the option.
   */
  description?: TranslatableString;
}

/**
 * Attribute types that support selectable options.
 * Used for attributes where a predefined list of choices is available,
 * such as PICKLIST (dropdowns) and UNIT (measurement units).
 */
export type SupportsOptions = AttributeType.PICKLIST | AttributeType.UNIT;

/**
 * Defines the attribute type for which custom values are supported.
 * Currently, only attributes of type PICKLIST allow user-defined custom values.
 */
export type SupportsCustomValue = AttributeType.PICKLIST;

/**
 * Attribute types that can have a default value.
 * This excludes BLOCK and TABLE types, which are structural and do not carry direct values.
 */
export type SupportsAttributeValue = Exclude<AttributeType, AttributeType.BLOCK | AttributeType.TABLE>;

/**
 * Defines a single dynamic attribute in a metadata-driven system.
 *
 * This interface is generic and strongly typed based on the attribute's `type`,
 * enabling intelligent default values, validation, rendering, and behavior control.
 *
 * Typical use cases include dynamic form generation, flexible data models, and custom entity configurations.
 *
 * @template T The specific {@link AttributeType} of this attribute (e.g., STRING, BOOLEAN, PICKLIST).
 */
export interface AttributeDefinition<T extends AttributeType = AttributeType> {
  /**
   * Globally unique identifier for the attribute definition.
   * Used for persistence, cross-referencing, and identification in external systems.
   */
  uuid: string;

  /**
   * Internal name (technical identifier) of the attribute.
   * Often used for binding, data keys, and conditional logic.
   */
  name: string;

  /**
   * The type of attribute, which determines its structure, input control, and value type.
   * See {@link AttributeType} for available types.
   */
  type: T;

  /**
   * Optional user-facing label shown in the UI.
   * If not provided, `name` may be used as a fallback.
   */
  label?: TranslatableString;

  /**
   * Optional descriptive text or tooltip that provides guidance to the user.
   * Supports improving UX by clarifying the attribute's purpose or usage.
   */
  description?: TranslatableString;

  /**
   * A list of constraints used to validate the attribute’s value.
   * Constraints can enforce rules like minimum/maximum length, value ranges, uniqueness, etc.
   */
  constraints?: Constraint[];

  /**
   * A list of selectable options for attributes of type `PICKLIST` or `UNIT`.
   *
   * - For `PICKLIST`, each option represents a possible value (e.g., country codes).
   * - For `UNIT`, each option represents a supported measurement unit (e.g., kg, lb).
   *
   * The `value` of the selected option must match the shape expected in the corresponding AttributeValue.
   */
  options?: T extends SupportsOptions ? Option[] : never;


  /**
   * Allows the user to enter a custom value not present in the predefined options.
   * Only applicable for attributes of type `PICKLIST`.
   */
  allowCustomValue?: T extends SupportsCustomValue ? boolean : never;

  /**
   * Indicates whether this attribute is mandatory.
   * Typically enforced by validation or constraints (e.g. NOT_NULL).
   */
  required?: boolean;

  /**
   * Marks the attribute as read-only, preventing user edits in the UI.
   * Typically used for derived or system-managed values.
   */
  readOnly?: boolean;

  /**
   * Marks the attribute as immutable, meaning it cannot be changed after creation.
   */
  immutable?: boolean;

  /**
   * The default value assigned to the attribute when no user input is provided.
   * The type of the value depends on the attribute's type (see {@link AttributeValue}).
   */
  defaultValue?: T extends SupportsAttributeValue ? AttributeValue<T> : never;
}

/**
 * A specialized attribute definition for TABLE attributes.
 * The table itself holds rows; each column is an attribute (excluding TABLE and BLOCK types).
 */
export interface TableAttributeDefinition extends Omit<AttributeDefinition<AttributeType.TABLE>, 'type' | 'defaultValue'> {
  /**
   * Always set to 'table' to indicate the attribute is of type TABLE.
   */
  type: AttributeType.TABLE;

  /**
   * Column definitions that define the schema of the table.
   * Each column is itself an attribute (e.g., STRING, NUMERIC), but must not be BLOCK or TABLE.
   */
  columns: AttributeDefinition<SupportsAttributeValue>[];
}

/**
 * A structural attribute used to group other attributes into logical sections.
 *
 * Blocks are layout elements with no direct value. They may contain:
 * - regular attributes (e.g., STRING, BOOLEAN, etc.)
 * - nested blocks (for recursive layout)
 * - tables
 */
export interface BlockAttributeDefinition extends Omit<AttributeDefinition<AttributeType.BLOCK>, 'type' | 'defaultValue'> {
  /**
   * Always set to 'block' to indicate this is a layout grouping element.
   */
  type: AttributeType.BLOCK;

  /**
   * Indicates whether this block can contain multiple instances.
   */
  multiple?: boolean;

  /**
   * The child attributes contained within this block.
   * Blocks may nest other blocks and define full attribute subtrees.
   */
  children: AttributeTypeDefinition[];
}

/**
 * Extended attribute definition that can be:
 *
 * - A regular attribute (e.g., STRING, BOOLEAN, PICKLIST)
 * - A table attribute with nested columns
 * - A block attribute with nested child attributes (including further blocks)
 */
export type AttributeTypeDefinition =
  | AttributeDefinition<Exclude<AttributeType, AttributeType.TABLE | AttributeType.BLOCK>>
  | TableAttributeDefinition
  | BlockAttributeDefinition;


/**
 * Common metadata fields for tracking creation and modification history of an entity.
 * Can be used for auditing, versioning, or change tracking purposes.
 */
export interface Auditable {
  /**
   * Identifier (e.g., username or ID) of the user who created the entity.
   */
  createdBy?: string;

  /**
   * ISO timestamp of when the entity was created.
   */
  createdAt?: string;

  /**
   * Identifier of the user who last modified the entity.
   */
  modifiedBy?: string;

  /**
   * ISO timestamp of the last modification.
   */
  modifiedAt?: string;

  /**
   * Optional version number, used for optimistic locking or tracking revisions.
   */
  version?: number;
}


/**
 * Represents a document composed of multiple dynamic attributes.
 * Common use cases include metadata-based forms, templates, or configurations.
 */
export interface DocumentDefinition extends Auditable {
  /**
   * Universally unique identifier for the document definition.
   */
  uuid: string;

  /**
   * Human-readable name of the document template or definition.
   */
  name: string;

  /**
   * The full list of attribute definitions that define the structure and constraints of the document.
   */
  attributes: AttributeTypeDefinition[];
}

export interface Identifiable {
  /**
   * Universally unique identifier for this attribute instance.
   * This allows tracking, referencing, and managing instances independently of their definitions.
   */
  uuid: string;
}

/**
 * Represents the runtime value of a single attribute instance within a document.
 *
 * Each attribute instance corresponds to one attribute defined in the {@link DocumentDefinition},
 * carrying both its `type` and current `value`.
 *
 * This generic interface ensures that values are type-safe and consistent
 * with the attribute's declared {@link AttributeType}.
 *
 * @template T The specific attribute type (e.g., STRING, BOOLEAN, TABLE).
 */
export interface AttributeInstance<T extends AttributeType = AttributeType> extends Identifiable {

  /**
   * The globally unique identifier of the attribute definition this instance is based on.
   */
  definitionId: string;

  /**
   * The type of the attribute, determining how the `value` should be interpreted.
   * This also enables type-safe rendering and validation at runtime.
   */
  type: T;

  /**
   * The actual value associated with this attribute instance.
   *
   * - For regular attributes (e.g., STRING, BOOLEAN), this will be a primitive or structured value.
   * - For `BLOCK` attributes, the value is a nested {@link BlockInstance}.
   * - For `TABLE` attributes, the value is a {@link TableInstance}.
   */
  value:
    T extends AttributeType.BLOCK ? BlockInstance | BlockInstance[] :
      T extends AttributeType.TABLE ? TableInstance :
        AttributeValue<T>;
}


/**
 * A block groups child attribute instances, recursively.
 */
export interface BlockInstance extends Identifiable {
  /**
   * The attribute instances (children) inside this block.
   */
  attributes: (
    | AttributeInstance<SupportsAttributeValue>
    | AttributeInstance<AttributeType.TABLE>
    | AttributeInstance<AttributeType.BLOCK>
    )[];
}

/**
 * A row in a table, composed of regular (non-structural) attribute instances.
 */
export interface TableRow extends Identifiable {

  /**
   * Column values for the row.
   * Only regular (non-BLOCK, non-TABLE) types are allowed.
   */
  columns: AttributeInstance<SupportsAttributeValue>[];
}

/**
 * A table contains multiple rows of column-based attribute values.
 */
export interface TableInstance extends Identifiable {
  /**
   * The data rows of the table, each composed of column-based attribute instances.
   */
  rows: TableRow[];
}

/**
 * Represents a fully populated document instance.
 * This is the runtime representation of a DocumentDefinition.
 */
export interface DocumentInstance {
  /**
   * Reference to the document definition UUID this instance is based on.
   */
  definitionUuid: string;

  /**
   * Optional user-defined label or name for the document instance.
   */
  name?: string;

  /**
   * The actual attribute values filled in by the user or system.
   */
  attributes: (
    | AttributeInstance<SupportsAttributeValue>
    | AttributeInstance<AttributeType.TABLE>
    | AttributeInstance<AttributeType.BLOCK>
    )[];

  /**
   * Optional metadata for tracking changes.
   */
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  version?: number;
}