import { Routes } from '@angular/router';
import { ProcessEditorComponent } from './components/process-editor/process-editor.component';

export const processRoutes: Routes = [
  {path: '', redirectTo: 'editor', pathMatch: 'full'},
  {
    path: 'editor',
    component: ProcessEditorComponent
  },
  {path: '**', redirectTo: 'editor'}
];