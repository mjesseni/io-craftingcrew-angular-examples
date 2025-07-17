import { Component, ElementRef, ViewChild } from '@angular/core';
import { AttributeType } from '../../../../model/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseAttributeComponent } from '../base-attribute.component';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-text-attribute',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Textarea
  ],
  templateUrl: './text-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class TextAttributeComponent extends BaseAttributeComponent<AttributeType.TEXT> {
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  constructor() {
    super(AttributeType.TEXT);
  }

  override focus() {
    this.inputRef?.nativeElement?.focus();
  }
}
