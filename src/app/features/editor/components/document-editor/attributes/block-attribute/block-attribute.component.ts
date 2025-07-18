import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { AttributeInstance, AttributeType, BlockAttributeDefinition } from '../../../../model/document.model';
import { DocumentEditorStore } from '../../../../store/document/document-editor.store';
import { Panel } from 'primeng/panel';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { getBlockInstances } from '../../../../store/document/document-utils';
import { BlockInstanceComponent } from './block-instance/block-instance.component';

@Component({
  selector: 'app-block-attribute',
  imports: [
    Panel,
    NgTemplateOutlet,
    BlockInstanceComponent,
    NgClass
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './block-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class BlockAttributeComponent {
  protected readonly AttributeType = AttributeType;
  protected readonly store = inject(DocumentEditorStore);

  readonly attribute = input.required({
    transform: (value: AttributeInstance) => {
      if (value.type !== AttributeType.BLOCK) {
        throw new Error(`Expected attribute type STRING, but got ${value.type}`);
      }
      return value as AttributeInstance<AttributeType.BLOCK>;
    }
  });
  readonly depth = input<number>(0);
  readonly attributeId = computed(() => this.attribute().uuid);
  readonly definition = computed(() => this.store.getAttributeDefById$(this.attributeId())());
  readonly name = computed(() => this.definition()?.label as string ?? '');
  readonly instances = computed(() => getBlockInstances(this.attribute(), this.definition() as BlockAttributeDefinition));
}
