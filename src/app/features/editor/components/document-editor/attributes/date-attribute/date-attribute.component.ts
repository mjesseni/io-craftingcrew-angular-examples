import { Component, ElementRef, ViewChild } from '@angular/core';
import { AttributeType } from '../../../../model/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseAttributeComponent } from '../base-attribute.component';

@Component({
  selector: 'app-date-attribute',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './date-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class DateAttributeComponent extends BaseAttributeComponent<AttributeType.DATE> {
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  constructor() {
    super(AttributeType.DATE);
  }

  override focus() {
    this.inputRef?.nativeElement?.focus();
  }
}
