import { computed, Directive, effect, inject, input } from '@angular/core';
import { AttributeInstance, AttributeType, AttributeValue } from '../../../model/document.model';
import { DocumentEditorStore } from '../../../store/document/document-editor.store';


@Directive()
export abstract class BaseAttributeComponent<T extends AttributeType> {
  protected readonly store = inject(DocumentEditorStore);

  readonly attribute = input.required({
    transform: (value: AttributeInstance) => {
      if (value.type !== this.expectedType) {
        throw new Error(`Expected attribute type STRING, but got ${value.type}`);
      }
      return value;
    }
  });
  readonly attributeId = computed(() => this.attribute().uuid);
  readonly attributeState = computed(() => {
    return this.store.attributeState$(this.attributeId())()
  });

  protected value!: AttributeValue<T>;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  protected constructor(private expectedType: T) {
    effect(() => {
      const s = this.attributeState();
      if (s?.transient?.focused) {
        queueMicrotask(() => this.focus());
      }
    });

    effect(() => {
      const s = this.attribute();
      this.value = s.value as AttributeValue<T>;
    });
  }

  protected abstract focus(): void;

  onInputChange(value: unknown) {
    this.store.updateAttributeValue({
      attributeId: this.attribute().uuid,
      newValue: value as T
    });
  }

  onFocus(): void {
    this.store.focusAttribute(this.attribute().uuid);
  }
}
