import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-boolean-attribute',
  imports: [],
  templateUrl: './boolean-attribute.component.html',
  styleUrl: './boolean-attribute.component.scss'
})
export class BooleanAttributeComponent {
  attribute = input<AttributeInstance>()
}
