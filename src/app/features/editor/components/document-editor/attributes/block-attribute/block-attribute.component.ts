import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { AttributeInstance, AttributeType } from '../../../../model/document.model';
import { AttributeContainerComponent } from '../attribute-container/attribute-container.component';
import { DocumentEditorStore } from '../../../../store/document/document-editor.store';
import { Panel } from 'primeng/panel';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-block-attribute',
  imports: [
    AttributeContainerComponent,
    Panel,
    NgTemplateOutlet
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './block-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class BlockAttributeComponent {
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
  readonly definition = computed(() =>
    this.store.getAttributeDefById$(this.attributeId())());
  readonly name = computed(() => this.definition()?.label as string ?? '');

  readonly nestedAttributes = computed(() => this.attribute().value.attributes || []);
  protected readonly AttributeType = AttributeType;
}
