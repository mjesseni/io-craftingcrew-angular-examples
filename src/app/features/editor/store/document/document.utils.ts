import { AttributeInstance, AttributeType, BlockInstance, TableInstance } from '../../model/document.model';

/**
 * Recursively searches for an attribute instance by ID in the given attribute list.
 */
export function findAttributeById(attributes: AttributeInstance[], attributeId: string): AttributeInstance | undefined {
  for (const attr of attributes) {
    if (attr.name === attributeId || (attr as any).uuid === attributeId) {
      return attr;
    }

    if (attr.type === AttributeType.BLOCK) {
      const nested = findAttributeById((attr.value as BlockInstance).attributes, attributeId);
      if (nested) return nested;
    }

    if (attr.type === AttributeType.TABLE) {
      const rows = (attr.value as TableInstance).rows;
      for (const row of rows) {
        const nested = findAttributeById(row.columns, attributeId);
        if (nested) return nested;
      }
    }
  }

  return undefined;
}