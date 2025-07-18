import { Component, computed, inject, input } from '@angular/core';
import { AttributeInstance, AttributeType } from '../../../../model/document.model';
import { BooleanAttributeComponent } from '../boolean-attribute/boolean-attribute.component';
import { DateAttributeComponent } from '../date-attribute/date-attribute.component';
import { NumericAttributeComponent } from '../numeric-attribute/numeric-attribute.component';
import { PicklistAttributeComponent } from '../picklist-attribute/picklist-attribute.component';
import { StringAttributeComponent } from '../string-attribute/string-attribute.component';
import { TableAttributeComponent } from '../table-attribute/table-attribute.component';
import { TextAttributeComponent } from '../text-attribute/text-attribute.component';
import { UnitAttributeComponent } from '../unit-attribute/unit-attribute.component';
import { DocumentEditorStore } from '../../../../store/document/document-editor.store';

@Component({
  selector: 'app-attribute-container',
  imports: [
    BooleanAttributeComponent,
    DateAttributeComponent,
    NumericAttributeComponent,
    PicklistAttributeComponent,
    StringAttributeComponent,
    TableAttributeComponent,
    TextAttributeComponent,
    UnitAttributeComponent
  ],
  templateUrl: './attribute-container.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class AttributeContainerComponent {
  protected readonly store = inject(DocumentEditorStore);
  protected readonly AttributeType = AttributeType;

  attribute = input.required<AttributeInstance>()

  readonly attributeId = computed(() => this.attribute().uuid);
  readonly definition = computed(() =>
    this.store.getAttributeDefById$(this.attribute().definitionId)());
  readonly name = computed(() => this.definition()?.label ?? '');
}
