import { Component, input } from '@angular/core';
import { AttributeInstance, AttributeType } from '../../../../model/document.model';
import { BlockAttributeComponent } from '../block-attribute/block-attribute.component';
import { BooleanAttributeComponent } from '../boolean-attribute/boolean-attribute.component';
import { DateAttributeComponent } from '../date-attribute/date-attribute.component';
import { NumericAttributeComponent } from '../numeric-attribute/numeric-attribute.component';
import { PicklistAttributeComponent } from '../picklist-attribute/picklist-attribute.component';
import { StringAttributeComponent } from '../string-attribute/string-attribute.component';
import { TableAttributeComponent } from '../table-attribute/table-attribute.component';
import { TextAttributeComponent } from '../text-attribute/text-attribute.component';
import { UnitAttributeComponent } from '../unit-attribute/unit-attribute.component';

@Component({
  selector: 'app-attribute-container',
  imports: [
    BlockAttributeComponent,
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
  styleUrl: './attribute-container.component.scss'
})
export class AttributeContainerComponent {
  protected readonly AttributeType = AttributeType;
  attribute = input.required<AttributeInstance>()
}
