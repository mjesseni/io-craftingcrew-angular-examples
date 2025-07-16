import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-table-attribute',
  imports: [],
  templateUrl: './table-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class TableAttributeComponent {
  attribute = input<AttributeInstance>()
}
