import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-numeric-attribute',
  imports: [],
  templateUrl: './numeric-attribute.component.html',
  styleUrl: './numeric-attribute.component.scss'
})
export class NumericAttributeComponent {
  attribute = input<AttributeInstance>()
}
