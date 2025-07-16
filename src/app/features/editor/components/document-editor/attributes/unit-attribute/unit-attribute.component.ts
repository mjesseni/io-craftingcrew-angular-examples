import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-unit-attribute',
  imports: [],
  templateUrl: './unit-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class UnitAttributeComponent {
  attribute = input<AttributeInstance>()
}
