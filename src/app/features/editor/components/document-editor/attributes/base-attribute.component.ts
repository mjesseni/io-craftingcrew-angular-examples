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
  readonly definition = computed(() =>
    this.store.getAttributeDefById$(this.attribute().definitionId)());
  readonly immutable = computed(() => this.definition().immutable);

  protected value = computed(() =>
    this.determineValue(this.attribute() as AttributeInstance<T>));

  // eslint-disable-next-line @angular-eslint/prefer-inject
  protected constructor(private expectedType: T) {
    effect(() => {
      const s = this.attributeState();
      if (s?.transient?.focused) {
        queueMicrotask(() => this.focus());
      }
    });
  }

  protected abstract focus(): void;

  protected determineValue(attr: AttributeInstance<T>): AttributeValue<T> {
    return attr.value as AttributeValue<T>;
  }

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
