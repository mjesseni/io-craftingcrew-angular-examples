import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { documentEditorReducer } from './store/document/document.reducer';
import { DocumentEffects } from './store/document/document.effects';

export const provideEditorFeatureStore = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideStore({
      'editor.document': documentEditorReducer,
    }),
    provideEffects([DocumentEffects]),
  ]);
};