# Setting up NgRx DevTools for ComponentStore and Feature Store

NgRx DevTools is a powerful debugging tool that integrates seamlessly with Angular applications to monitor and debug application state changes. This guide provides a step-by-step process for setting up NgRx DevTools for both **ComponentStore** and **Feature Store** and installing the Chrome extension.

---

## 1. Install NgRx DevTools

Run the following command to install the required package:

```bash
npm install @ngrx/store-devtools
```

---

## 2. Install Redux DevTools for Chrome

1. Open the Chrome Web Store.
   - Navigate to [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).

2. Click **Add to Chrome**.
   - Confirm the installation by clicking **Add Extension**.

3. Verify installation.
   - The Redux DevTools icon will appear in your Chrome toolbar.
   - Alternatively, you can check `chrome://extensions/` for the extension.

---

## 3. Setting up NgRx DevTools for Feature Store

### Configure NgRx DevTools in App Module

To use NgRx DevTools with the global store (Feature Store), you need to integrate the `StoreDevtoolsModule`.

#### Example Setup:

1. Import `StoreModule` and `StoreDevtoolsModule` in your `AppModule`.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './state/app.reducer'; // Your global reducers
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers), // Register global reducers
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retain the last 25 state changes
      logOnly: environment.production, // Log-only in production
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

2. Define your global reducers:

#### `state/app.reducer.ts`
```typescript
import { ActionReducerMap } from '@ngrx/store';
import { featureAReducer } from '../feature-a/state/feature-a.reducer';
import { featureBReducer } from '../feature-b/state/feature-b.reducer';

export interface AppState {
  featureA: any; // Replace with your actual state interface
  featureB: any;
}

export const reducers: ActionReducerMap<AppState> = {
  featureA: featureAReducer,
  featureB: featureBReducer,
};
```

3. Install and configure the Redux DevTools extension (as described in step 2).

---

## 4. Setting up NgRx DevTools for ComponentStore

Unlike the global store, **ComponentStore** does not automatically register itself with NgRx DevTools. You need to manually connect it to Redux DevTools.

### Steps:

1. Install the `redux-devtools-extension` library.

```bash
npm install redux-devtools-extension
```

2. Integrate DevTools into your `ComponentStore`.

#### Example: `counter.store.ts`

```typescript
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { devToolsEnhancer } from 'redux-devtools-extension';

export interface CounterState {
  count: number;
}

@Injectable()
export class CounterStore extends ComponentStore<CounterState> {
  private readonly devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({
    name: 'CounterStore', // Name visible in Redux DevTools
    maxAge: 25, // Retain the last 25 state changes
  });

  constructor() {
    super({ count: 0 }); // Initial state
  }

  // Updater to increment the count
  readonly increment = this.updater((state) => {
    const newState = { ...state, count: state.count + 1 };
    this.logStateChange('Increment', newState);
    return newState;
  });

  // Log state changes to Redux DevTools
  private logStateChange(action: string, newState: CounterState) {
    this.devTools?.send(action, newState);
  }
}
```

3. Use the `CounterStore` in your component as normal. All state updates will now appear in Redux DevTools.

---

## 5. Setting up NgRx DevTools for Feature Standalone Components

In Angular 15+ and beyond, you can use **standalone components** with NgRx Feature Stores and DevTools. Here’s how you can set up NgRx DevTools for a feature store in a standalone component:

### Steps:

1. Import `provideStore` and `provideStoreDevtools` in the standalone component.

#### Example: `feature-a.component.ts`
```typescript
import { Component } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { featureAReducer } from './state/feature-a.reducer';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-feature-a',
  standalone: true,
  imports: [],
  providers: [
    provideStore({ featureA: featureAReducer }), // Register the feature store
    provideStoreDevtools({
      maxAge: 25, // Retain last 25 states
      logOnly: environment.production, // Restrict to log-only in production
    }),
  ],
  template: `
    <div class="text-center">
      <h1>Feature A</h1>
      <button (click)="increment()">Increment</button>
    </div>
  `,
})
export class FeatureAComponent {
  // Component logic here
}
```

2. Integrate feature-specific state updates and actions.
   - Actions and state updates within the standalone component will automatically appear in Redux DevTools if the store is correctly registered.

---

## 6. Feature-Based Project Setup

A feature-based project organizes state and logic by feature modules, making it modular and scalable. Here's how to set it up:

### Project Structure
```text
src/
├── app/
│   ├── state/              # Global application state
│   │   ├── app.reducer.ts  # Global reducer map
│   │   └── app.state.ts    # Global state interface
│   ├── feature-a/          # Feature A module
│   │   ├── state/          # Feature A state management
│   │   │   ├── feature-a.actions.ts
│   │   │   ├── feature-a.reducer.ts
│   │   │   ├── feature-a.selectors.ts
│   │   │   └── feature-a.state.ts
│   │   └── feature-a.module.ts
│   ├── feature-b/          # Feature B module
│   │   ├── state/          # Feature B state management
│   │   │   ├── feature-b.actions.ts
│   │   │   ├── feature-b.reducer.ts
│   │   │   ├── feature-b.selectors.ts
│   │   │   └── feature-b.state.ts
│   │   └── feature-b.module.ts
│   └── app.module.ts       # Root module
```

### Steps:

1. **Feature Module Setup**:
   - Each feature module has its own state, actions, reducers, and selectors.

#### Example: Feature A Reducer
```typescript
import { createReducer, on } from '@ngrx/store';
import { increment, decrement } from './feature-a.actions';
import { FeatureAState } from './feature-a.state';

export const initialState: FeatureAState = {
  counter: 0,
};

export const featureAReducer = createReducer(
  initialState,
  on(increment, (state) => ({ ...state, counter: state.counter + 1 })),
  on(decrement, (state) => ({ ...state, counter: state.counter - 1 }))
);
```

2. **Register Feature Store**:
   - In the feature module:

#### Example: Feature A Module
```typescript
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { featureAReducer } from './state/feature-a.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('featureA', featureAReducer),
  ],
})
export class FeatureAModule {}
```

3. **Global Integration**:
   - Register the global reducer map in the `AppModule` or root module.

4. **Enable DevTools**:
   - NgRx DevTools will automatically detect and track feature stores.

---

## 7. Debugging with Redux DevTools

- Open your Angular app in the browser.
- Open Chrome DevTools (`Ctrl+Shift+I` or `Cmd+Option+I`), then navigate to the **Redux** tab.
- View all actions (`Increment`, `Decrement`, etc.) and state updates for both Feature Stores and ComponentStores.

---

## 8. Best Practices

1. **Environment-based Configuration:** Ensure DevTools are enabled only in development mode:

```typescript
StoreDevtoolsModule.instrument({
   maxAge: 25,
   logOnly: environment.production, // Restrict to log-only mode in production
});
```

2. **Action Naming:** Use meaningful action names to make state changes easier to debug.

3. **State Shape:** Keep your state shape simple and modular for better traceability.

---

## Final Notes

With this setup, you can debug and monitor both global and component-level states effectively using NgRx DevTools and Redux DevTools. If you encounter any issues, ensure your dependencies are up to date and that the Redux DevTools Chrome extension is installed and active.
