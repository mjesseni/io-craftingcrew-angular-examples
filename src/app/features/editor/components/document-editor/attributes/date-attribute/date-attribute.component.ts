import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-date-attribute',
  imports: [],
  templateUrl: './date-attribute.component.html',
  styleUrl: './date-attribute.component.scss'
})
export class DateAttributeComponent {
  attribute = input<AttributeInstance>()
}
