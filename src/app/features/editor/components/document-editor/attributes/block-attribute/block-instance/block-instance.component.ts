import { Component, computed, forwardRef, input } from '@angular/core';
import { AttributeType, BlockInstance } from '../../../../../model/document.model';
import { AttributeContainerComponent } from '../../attribute-container/attribute-container.component';
import { BlockAttributeComponent } from '../block-attribute.component';

@Component({
  selector: 'app-block-instance',
  imports: [
    AttributeContainerComponent,
    forwardRef(() => BlockAttributeComponent)
  ],
  templateUrl: './block-instance.component.html',
  styleUrl: './../../../../../editor-styles.scss'
})
export class BlockInstanceComponent {
  protected readonly AttributeType = AttributeType;

  readonly block = input.required<BlockInstance>();
  readonly depth = input<number>(0);
  readonly attributes = computed(() => this.block().attributes || []);
}
