import { AttributeInstance, AttributeType, BlockAttributeDefinition, BlockInstance } from '../../model/document.model';

export function getBlockInstances(attr: AttributeInstance, def: BlockAttributeDefinition) {
  const block = attr as AttributeInstance<AttributeType.BLOCK>;
  const blocks: BlockInstance[] = [];

  if (def?.multiple) {
    blocks.push(...(block.value as BlockInstance[]));
  } else {
    blocks.push(block.value as BlockInstance);
  }
  return blocks;
}