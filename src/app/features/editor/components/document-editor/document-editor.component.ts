import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditorState } from '../../store/document/document.state';
import { selectAttributes, selectDocument, selectFocusedAttributeId } from '../../store/document/document.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AttributeContainerComponent } from './attributes/attribute-container/attribute-container.component';
import { AttributeType, DocumentInstance } from '../../model/document.model';
import { loadDocumentInstance } from '../../store/document/document.actions';

export function createSampleDocument(): DocumentInstance {
  return {
    definitionUuid: 'incident-definition',
    attributes: [
      {
        uuid: 'title',
        name: 'title',
        type: AttributeType.STRING,
        value: 'Network outage in datacenter',
      },
      {
        uuid: 'severity',
        name: 'severity',
        type: AttributeType.PICKLIST,
        value: 'HIGH',
      },
      {
        uuid: 'reportedAt',
        name: 'reportedAt',
        type: AttributeType.DATE,
        value: new Date().toISOString(),
      },
      {
        uuid: 'status',
        name: 'status',
        type: AttributeType.PICKLIST,
        value: 'NEW',
      },
      {
        uuid: 'description',
        name: 'description',
        type: AttributeType.TEXT,
        value: 'Systems in Zone A are unreachable.',
      },
      {
        uuid: 'resolution',
        name: 'resolution',
        type: AttributeType.TEXT,
        value: '',
      }
    ]
  };
}


@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, AttributeContainerComponent],
  templateUrl: './document-editor.component.html',
  styleUrl: './document-editor.component.scss'
})
export class DocumentEditorComponent {
  private readonly store = inject<Store<DocumentEditorState>>(Store);

  /**
   * Signal for the entire document instance.
   */
  readonly document = toSignal(this.store.select(selectDocument),
    {initialValue: {definitionUuid: '', attributes: []}});

  /**
   * Signal for the top-level attributes in the document.
   */
  readonly attributes = toSignal(this.store.select(selectAttributes),
    {initialValue: []});

  /**
   * Signal for the currently focused attribute ID.
   */
  readonly focusedAttributeId = toSignal(this.store.select(selectFocusedAttributeId),
    {initialValue: undefined});

  /**
   * Derived signal for the title (example use of computed).
   */
  readonly documentTitle = computed(() => `Editing: ${this.document().definitionUuid || 'New Document'}`);


  constructor() {
    this.store.dispatch(loadDocumentInstance({document: createSampleDocument()}));
  }
}
