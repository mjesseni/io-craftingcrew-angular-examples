import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeContainerComponent } from './attributes/attribute-container/attribute-container.component';
import { AttributeType, DocumentDefinition, DocumentInstance, ValueSourceType } from '../../model/document.model';
import { DocumentEditorStore } from '../../store/document/document-editor.store';
import { BlockAttributeComponent } from './attributes/block-attribute/block-attribute.component';

export const incidentDefinition: DocumentDefinition = {
  uuid: 'incident-definition',
  name: 'Incident Report',
  attributes: [
    {
      uuid: 'general',
      name: 'general',
      type: AttributeType.BLOCK,
      label: 'General Information',
      children: [
        {
          uuid: 'number',
          name: 'number',
          type: AttributeType.STRING,
          label: 'Incident Number',
          required: true,
          immutable: true
        },
        {
          uuid: 'title',
          name: 'title',
          type: AttributeType.STRING,
          label: 'Incident Title',
          required: true
        },
        {
          uuid: 'severity',
          name: 'severity',
          type: AttributeType.PICKLIST,
          label: 'Severity',
          required: true,
          options: [
            {value: 'LOW', label: 'Low'},
            {value: 'MEDIUM', label: 'Medium'},
            {value: 'HIGH', label: 'High'},
            {value: 'CRITICAL', label: 'Critical'}
          ],
          allowCustomValue: false
        },
        {
          uuid: 'reportedAt',
          name: 'reportedAt',
          type: AttributeType.DATE,
          label: 'Reported At',
          required: true
        },
        {
          uuid: 'status',
          name: 'status',
          type: AttributeType.PICKLIST,
          label: 'Status',
          required: true,
          options: [
            {value: 'NEW', label: 'New'},
            {value: 'INVESTIGATING', label: 'Investigating'},
            {value: 'RESOLVED', label: 'Resolved'},
            {value: 'CLOSED', label: 'Closed'}
          ],
          allowCustomValue: false
        },
        {
          uuid: 'description',
          name: 'description',
          type: AttributeType.TEXT,
          label: 'Description'
        },
        {
          uuid: 'resolution',
          name: 'resolution',
          type: AttributeType.TEXT,
          label: 'Resolution'
        }
      ]
    },
    {
      uuid: 'reporterDetails',
      name: 'reporterDetails',
      type: AttributeType.BLOCK,
      label: 'Reporter Details',
      children: [
        {
          uuid: 'reporterName',
          name: 'reporterName',
          type: AttributeType.STRING,
          label: 'Reporter Name',
          required: true
        },
        {
          uuid: 'reporterDepartment',
          name: 'reporterDepartment',
          type: AttributeType.STRING,
          label: 'Department'
        },
        {
          uuid: 'reporterRole',
          name: 'reporterRole',
          type: AttributeType.STRING,
          label: 'Role / Position'
        },
        {
          uuid: 'reportedVia',
          name: 'reportedVia',
          type: AttributeType.PICKLIST,
          label: 'Reported Via',
          options: [
            {value: 'EMAIL', label: 'Email'},
            {value: 'PHONE', label: 'Phone'},
            {value: 'IN_PERSON', label: 'In Person'},
            {value: 'SYSTEM', label: 'System Auto-Report'}
          ],
          allowCustomValue: false
        },
        {
          uuid: 'reporterContact',
          name: 'reporterContact',
          type: AttributeType.BLOCK,
          label: 'Contact Information',
          children: [
            {
              uuid: 'email',
              name: 'email',
              type: AttributeType.STRING,
              label: 'Email Address',
              required: true
            },
            {
              uuid: 'phone',
              name: 'phone',
              type: AttributeType.STRING,
              label: 'Phone Number'
            }
          ]
        }
      ]
    },
    {
      uuid: 'addresses',
      name: 'addresses',
      type: AttributeType.BLOCK,
      label: 'Addresses',
      multiple: true,
      children: [
        {
          uuid: 'addressType',
          name: 'addressType',
          type: AttributeType.PICKLIST,
          label: 'Address Type',
          required: true,
          options: [
            { value: 'INVOICE', label: 'Invoice Address' },
            { value: 'SHIPPING', label: 'Shipping Address' },
            { value: 'OTHER', label: 'Other' }
          ],
          allowCustomValue: false
        },
        {
          uuid: 'street',
          name: 'street',
          type: AttributeType.STRING,
          label: 'Street',
          required: true
        },
        {
          uuid: 'postalCode',
          name: 'postalCode',
          type: AttributeType.STRING,
          label: 'Postal Code',
          required: true
        },
        {
          uuid: 'city',
          name: 'city',
          type: AttributeType.STRING,
          label: 'City',
          required: true
        },
        {
          uuid: 'country',
          name: 'country',
          type: AttributeType.STRING,
          label: 'Country',
          required: true
        }
      ]
    }
  ]
};

export function createSampleDocument(): DocumentInstance {
  return {
    definitionUuid: 'incident-definition',
    name: 'Sample Incident Report',
    attributes: [
      {
        uuid: 'general',
        definitionId: 'general',
        type: AttributeType.BLOCK,
        value: {
          uuid: 'general',
          attributes: [
            {
              uuid: 'number',
              definitionId: 'number',
              type: AttributeType.STRING,
              value: 'S2INC-2025-001'
            },
            {
              uuid: 'title',
              definitionId: 'title',
              type: AttributeType.STRING,
              value: 'Network outage in datacenter'
            },
            {
              uuid: 'severity',
              definitionId: 'severity',
              type: AttributeType.PICKLIST,
              value: {
                type: ValueSourceType.OPTION,
                value: { value: 'HIGH', label: 'High' }
              }
            },
            {
              uuid: 'reportedAt',
              definitionId: 'reportedAt',
              type: AttributeType.DATE,
              value: new Date().toISOString()
            },
            {
              uuid: 'status',
              definitionId: 'status',
              type: AttributeType.PICKLIST,
              value: {
                type: ValueSourceType.OPTION,
                value: { value: 'NEW', label: 'New' }
              }
            },
            {
              uuid: 'description',
              definitionId: 'description',
              type: AttributeType.TEXT,
              value: 'Systems in Zone A are unreachable.'
            },
            {
              uuid: 'resolution',
              definitionId: 'resolution',
              type: AttributeType.TEXT,
              value: ''
            }
          ]
        }
      },
      {
        uuid: 'reporterDetails',
        definitionId: 'reporterDetails',
        type: AttributeType.BLOCK,
        value: {
          uuid: 'reporterDetails',
          attributes: [
            {
              uuid: 'reporterName',
              definitionId: 'reporterName',
              type: AttributeType.STRING,
              value: 'Jane Doe'
            },
            {
              uuid: 'reporterDepartment',
              definitionId: 'reporterDepartment',
              type: AttributeType.STRING,
              value: 'IT Infrastructure'
            },
            {
              uuid: 'reporterRole',
              definitionId: 'reporterRole',
              type: AttributeType.STRING,
              value: 'Network Administrator'
            },
            {
              uuid: 'reportedVia',
              definitionId: 'reportedVia',
              type: AttributeType.PICKLIST,
              value: {
                type: ValueSourceType.OPTION,
                value: { value: 'EMAIL', label: 'Email' }
              }
            },
            {
              uuid: 'reporterContact',
              definitionId: 'reporterContact',
              type: AttributeType.BLOCK,
              value: {
                uuid: 'reporterContact',
                attributes: [
                  {
                    uuid: 'email',
                    definitionId: 'email',
                    type: AttributeType.STRING,
                    value: 'jane.doe@example.com'
                  },
                  {
                    uuid: 'phone',
                    definitionId: 'phone',
                    type: AttributeType.STRING,
                    value: '+1-234-567-890'
                  }
                ]
              }
            }
          ]
        }
      },
      {
        uuid: 'addresses',
        definitionId: 'addresses',
        type: AttributeType.BLOCK,
        value: [
          {
            uuid: 'invoice-address',
            attributes: [
              {
                uuid: 'invoice-address/addressType',
                definitionId: 'addressType',
                type: AttributeType.PICKLIST,
                value: {
                  type: ValueSourceType.OPTION,
                  value: { value: 'INVOICE', label: 'Invoice Address' }
                }
              },
              {
                uuid: 'invoice-address/street',
                definitionId: 'street',
                type: AttributeType.STRING,
                value: 'Main Street 1'
              },
              {
                uuid: 'invoice-address/postalCode',
                definitionId: 'postalCode',
                type: AttributeType.STRING,
                value: '1000'
              },
              {
                uuid: 'invoice-address/city',
                definitionId: 'city',
                type: AttributeType.STRING,
                value: 'Vienna'
              },
              {
                uuid: 'invoice-address/country',
                definitionId: 'country',
                type: AttributeType.STRING,
                value: 'Austria'
              }
            ]
          },
          {
            uuid: 'shipping-address',
            attributes: [
              {
                uuid: 'shipping-address/addressType',
                definitionId: 'addressType',
                type: AttributeType.PICKLIST,
                value: {
                  type: ValueSourceType.OPTION,
                  value: { value: 'SHIPPING', label: 'Shipping Address' }
                }
              },
              {
                uuid: 'shipping-address/street',
                definitionId: 'street',
                type: AttributeType.STRING,
                value: 'Warehouse Lane 7'
              },
              {
                uuid: 'shipping-address/postalCode',
                definitionId: 'postalCode',
                type: AttributeType.STRING,
                value: '2000'
              },
              {
                uuid: 'shipping-address/city',
                definitionId: 'city',
                type: AttributeType.STRING,
                value: 'Graz'
              },
              {
                uuid: 'shipping-address/country',
                definitionId: 'country',
                type: AttributeType.STRING,
                value: 'Austria'
              }
            ]
          }
        ]
      }
    ]
  };
}



@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, AttributeContainerComponent, BlockAttributeComponent],
  providers: [DocumentEditorStore],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent {
  private readonly store = inject(DocumentEditorStore);
  @ViewChild('editorContent') editorWrapper!: ElementRef<HTMLElement>;

  /**
   * Signal for the entire document instance.
   */
  readonly document = this.store.document$;

  /**
   * Signal for the top-level attributes in the document.
   */
  readonly attributes = this.store.attributes$;

  /**
   * Derived signal for the title (example use of computed).
   */
  readonly documentTitle = computed(() => `${this.document()?.name || 'New Document'}`);

  /**
   * This is derived from the store's dirty state.
   */
  readonly dirty = this.store.dirty$;

  readonly focusedAttribute = this.store.focusedAttribute$;


  constructor() {
    this.store.loadDocument({document: createSampleDocument(), definition: incidentDefinition})
  }

  protected onUndo() {
    this.store.undo();
  }

  protected onRedo() {
    this.store.redo();
  }

  protected onKeyDown(evt: KeyboardEvent) {
    const {key, shiftKey} = evt;

    if (key !== 'Tab' && key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Enter') return;

    const moveFocus = this.canMoveFocus(evt);
    if (moveFocus) {
      evt.preventDefault();
    }

    setTimeout(() => {
      if (key === 'Tab') {
        if (shiftKey) {
          this.store.focusPrevious();
        } else {
          this.store.focusNext();
        }
      } else if (key === 'ArrowDown') {
        this.store.focusNext();
      } else if (key === 'ArrowUp') {
        this.store.focusPrevious();
      } else if (key === 'Enter' && moveFocus) {
        this.store.focusNext();
      }
    }, 0)
  }

  protected onFocusOut(evt: FocusEvent) {
    const relatedTarget = evt.relatedTarget as HTMLElement | null;
    const editorEl = this.editorWrapper.nativeElement;
    if (!relatedTarget || !editorEl.contains(relatedTarget)) {
      this.store.clearFocus();
    }
  }

  protected readonly AttributeType = AttributeType;

  protected canMoveFocus(evt: KeyboardEvent): boolean {
    const {key} = evt;
    const target = evt.target as HTMLElement;
    if (key === 'Enter') {
      return !(target.closest('.multiline') !== null);
    }
    return true;
  }

  protected preventFocusLoss(evt: MouseEvent) {
    const target = evt.target as HTMLElement;
    const isFocusable = target.closest('.focusable') !== null;
    if (!isFocusable) {
      evt.preventDefault(); // Prevents input from losing focus
    }
  }
}
