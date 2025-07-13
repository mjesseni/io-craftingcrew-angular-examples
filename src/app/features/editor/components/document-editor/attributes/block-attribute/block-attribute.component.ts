import { Component, input } from '@angular/core';
import { AttributeInstance } from '../../../../model/document.model';

@Component({
  selector: 'app-block-attribute',
  imports: [],
  templateUrl: './block-attribute.component.html',
  styleUrl: './block-attribute.component.scss'
})
export class BlockAttributeComponent {
  attribute = input<AttributeInstance>()
}
