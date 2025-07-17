import { Component, computed, HostListener, signal, ViewChild } from '@angular/core';
import { AttributeType, AttributeValue, Option, ValueSourceType } from '../../../../model/document.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseAttributeComponent } from '../base-attribute.component';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { isString } from '@jsverse/transloco';

@Component({
  selector: 'app-picklist-attribute',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AutoComplete
  ],
  templateUrl: './picklist-attribute.component.html',
  styleUrl: './../../../../editor-styles.scss'
})
export class PicklistAttributeComponent extends BaseAttributeComponent<AttributeType.PICKLIST> {
  @ViewChild('input') autoComplete!: AutoComplete;

  protected readonly filteredValues = signal<Option[]>([]);
  protected readonly selection = computed(() => {
    const option = (this.transientValue?.value || this.value().value) as Option;
    return this.definition().options?.find(opt => opt.value === option.value) || option;
  });

  /* This is a transient value that holds the currently selected option */
  private transientValue: AttributeValue<AttributeType.PICKLIST> | undefined;

  constructor() {
    super(AttributeType.PICKLIST);
  }

  protected filterValues(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredValues.set(this.getFilteredOptions(query));
  }

  private getFilteredOptions(query: string) {
    return this.definition().options?.filter((option: Option) => {
      return this.getOptionLabel(option).includes(query);
    }) || [];
  }

  override onInputChange(event: AutoCompleteSelectEvent): void {
    const selectedOption = event.value as Option;
    if (!selectedOption) return;

    this.transientValue = {type: ValueSourceType.OPTION, value: selectedOption};
  }

  override focus() {
    this.autoComplete?.inputEL?.nativeElement?.focus();
  }

  protected getOptionLabel(option: Option | undefined): string {
    if (!option) return '';
    if (isString(option.label)) {
      return option.label;
    } else {
      return option.label['text'] || '';
    }
  }

  @HostListener('keydown.f2', ['$event'])
  onToggleOptionsOverlay(evt: KeyboardEvent): void {
    evt.preventDefault(); // Optional: prevent browser default (e.g. print)
    this.toggleOptions();
  }

  private toggleOptions() {
    if (this.autoComplete?.overlayVisible) {
      this.autoComplete.hide();
    } else {
      this.filteredValues.set(this.getFilteredOptions(''));
      this.autoComplete.show();
    }
  }

  protected commitInputChange() {
    if (this.transientValue && !this.autoComplete.overlayVisible) {
      super.onInputChange(this.transientValue);
      this.transientValue = undefined;
    }
  }
}
