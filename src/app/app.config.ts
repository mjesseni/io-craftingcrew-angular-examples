import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideMonacoEditor} from 'ngx-monaco-editor-v2';
import {provideTransloco} from '@jsverse/transloco';
import {TranslationLoaderService} from './shared/services/translation/translation-loader.service';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {providePrimeNG} from "primeng/config";
import {customThemePreset} from "../../customThemePreset";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {provideRouterStore, routerReducer} from "@ngrx/router-store";
import {provideStore} from "@ngrx/store";
import {todoReducer} from "./features/todos/store/todo.reducer";
import {provideEffects} from "@ngrx/effects";
import {TodoEffects} from "./features/todos/store/todo.effects";

export const appConfig: ApplicationConfig = {

  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: customThemePreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      },
    }),
    provideMonacoEditor({
      baseUrl: './assets/monaco/vs', // Location of Monaco assets
    }),
    provideHttpClient(),
    provideRouter(routes,
      withRouterConfig({onSameUrlNavigation: 'reload'})
    ),
    provideAnimations(), provideHttpClient(), provideTransloco({
      config: {
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslationLoaderService
    }),

    provideStore({
      router: routerReducer,
      todo: todoReducer,
    }),
    provideEffects([TodoEffects]),
    provideRouterStore(),

    /* dev tools */
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ]
};
