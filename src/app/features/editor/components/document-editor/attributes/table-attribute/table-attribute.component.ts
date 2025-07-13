import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-table-attribute',
  imports: [],
  templateUrl: './table-attribute.component.html',
  styleUrl: './table-attribute.component.scss'
})
export class TableAttributeComponent {
  attribute = input<AttributeInstance>()
}
