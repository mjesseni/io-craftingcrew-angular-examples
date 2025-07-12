import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import * as echarts from 'echarts/core';
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
import {provideState, provideStore} from "@ngrx/store";
import {provideTodoFeatureStore} from "./features/todos/todo.providers";
import {provideClockingFeatureStore} from "./features/clocking/clocking.providers";
import {todoReducer} from "./features/todos/store/todo.reducer";
import {approvalReducer} from "./features/clocking/store/approval/approval.reducer";
import {provideEchartsCore} from "ngx-echarts";
import {provideNgxMask} from "ngx-mask";
import {trackingReducer} from "./features/clocking/store/tracking/tracking.reducer";

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

    provideNgxMask(),
    provideEchartsCore({echarts}),
    provideState('router', routerReducer), // Register 'router' as a feature state
    provideState('todo', todoReducer),
    provideState('clocking.approval', approvalReducer),
    provideState('clocking.tracking', trackingReducer),
    provideStore(), // Provide the root store
    provideRouterStore(), // Configure the router state management
    provideTodoFeatureStore(),
    provideClockingFeatureStore(),

    /* dev tools */
    provideStoreDevtools({
      maxAge: 25,
      trace: false,
      traceLimit: 25,
      logOnly: !isDevMode(),
    }),
  ]
};
