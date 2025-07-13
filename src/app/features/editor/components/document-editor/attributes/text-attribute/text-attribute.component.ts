import { Component, inject, input } from '@angular/core';
import { AttributeInstance, AttributeType, AttributeValue } from '../../../../model/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DocumentEditorState } from '../../../../store/document/document.state';
import { updateAttributeValue } from '../../../../store/document/document.actions';

@Component({
  selector: 'app-text-attribute',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './text-attribute.component.html',
  styleUrl: './text-attribute.component.scss'
})
export class TextAttributeComponent {
  private readonly store = inject<Store<DocumentEditorState>>(Store);
  readonly attribute = input.required({
    transform: (value: AttributeInstance) => {
      if (value.type !== AttributeType.TEXT) {
        throw new Error(`Expected attribute type STRING, but got ${value.type}`);
      }
      return value as AttributeInstance<AttributeType.TEXT>;
    }
  });

  onInputChange(newValue: string) {
    this.store.dispatch(updateAttributeValue()({
        attributeId: this.attribute.name,
        attributeType: AttributeType.TEXT,
        newValue: newValue as AttributeValue<AttributeType.TEXT>
      })
    );
  }
}
