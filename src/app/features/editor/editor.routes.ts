import { Routes } from '@angular/router';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';

export const editorRoutes: Routes = [
  {
    path: '',
    component: DocumentEditorComponent
  },
  {path: '**', redirectTo: ''}
];