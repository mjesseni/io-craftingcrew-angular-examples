import { Component, input } from '@angular/core';
import { AttributeInstance, AttributeType } from '../../../../model/document.model';

@Component({
  selector: 'app-picklist-attribute',
  imports: [],
  templateUrl: './picklist-attribute.component.html',
  styleUrl: './picklist-attribute.component.scss'
})
export class PicklistAttributeComponent {
  attribute = input<AttributeInstance>()
}
