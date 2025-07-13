import { Component, inject, input } from '@angular/core';
import { AttributeInstance, AttributeType, AttributeValue } from '../../../../model/document.model';
import { Store } from '@ngrx/store';
import { DocumentEditorState } from '../../../../store/document/document.state';
import { updateAttributeValue } from '../../../../store/document/document.actions';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-string-attribute',
  imports: [
    FormsModule
  ],
  templateUrl: './string-attribute.component.html',
  styleUrl: './string-attribute.component.scss'
})
export class StringAttributeComponent {
  private readonly store = inject<Store<DocumentEditorState>>(Store);
  readonly attribute = input.required({
    transform: (value: AttributeInstance) => {
      if (value.type !== AttributeType.STRING) {
        throw new Error(`Expected attribute type STRING, but got ${value.type}`);
      }
      return value as AttributeInstance<AttributeType.STRING>;
    }
  });

  onInputChange(newValue: string) {
    this.store.dispatch(updateAttributeValue()({
        attributeId: this.attribute.name,
        attributeType: AttributeType.STRING,
        newValue: newValue as AttributeValue<AttributeType.STRING>
      })
    );
  }
}
