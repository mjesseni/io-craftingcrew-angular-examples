import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-unit-attribute',
  imports: [],
  templateUrl: './unit-attribute.component.html',
  styleUrl: './unit-attribute.component.scss'
})
export class UnitAttributeComponent {
  attribute = input<AttributeInstance>()
}
