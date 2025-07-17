import { Component, ElementRef, ViewChild } from '@angular/core';
import { AttributeType } from '../../../../model/document.model';
import { FormsModule } from '@angular/forms';
import { BaseAttributeComponent } from '../base-attribute.component';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-string-attribute',
  imports: [
    FormsModule,
    InputText
  ],
  templateUrl: './string-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class StringAttributeComponent extends BaseAttributeComponent<AttributeType.STRING> {
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  constructor() {
    super(AttributeType.STRING);
  }

  override focus() {
    this.inputRef?.nativeElement?.focus();
  }
}
