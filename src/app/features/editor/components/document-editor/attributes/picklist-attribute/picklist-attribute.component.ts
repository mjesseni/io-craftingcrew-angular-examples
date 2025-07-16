import { Component, ElementRef, ViewChild } from '@angular/core';
import { AttributeType } from '../../../../model/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseAttributeComponent } from '../base-attribute.component';

@Component({
  selector: 'app-picklist-attribute',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './picklist-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class PicklistAttributeComponent extends BaseAttributeComponent<AttributeType.PICKLIST> {
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  constructor() {
    super(AttributeType.PICKLIST);
  }

  override focus() {
    this.inputRef?.nativeElement?.focus();
  }
}
