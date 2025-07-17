import { Component, effect, ViewChild } from '@angular/core';
import { AttributeType } from '../../../../model/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseAttributeComponent } from '../base-attribute.component';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-date-attribute',
  imports: [
    DatePicker,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './date-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class DateAttributeComponent extends BaseAttributeComponent<AttributeType.DATE> {
  @ViewChild('input') datePicker!: DatePicker;

  constructor() {
    super(AttributeType.DATE);

    effect(() => {
      if (!this.attributeState()?.transient?.focused) {
        this.datePicker?.hideOverlay();
      }
    });
  }

  override focus() {
    this.datePicker.inputfieldViewChild?.nativeElement.focus();
  }
}
