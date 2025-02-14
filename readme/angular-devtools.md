# How to Use and Install Angular Signal DevTools

Angular Signal DevTools is a browser extension that allows you to inspect, debug, and monitor signals in your Angular applications. It provides insights into signal values, dependencies, and updates in real time.

---

## Installation

Follow these steps to install Angular Signal DevTools:

### 1. Prerequisites
- Ensure that your Angular application is using **Angular 19 or above**.
- Use a modern browser like **Google Chrome** or **Microsoft Edge**.

### 2. Install the Browser Extension
- **Google Chrome**:
    1. Open the [Chrome Web Store](https://chrome.google.com/webstore).
    2. Search for **Angular Signal DevTools**.
    3. Click **Add to Chrome** to install the extension.

- **Microsoft Edge**:
    1. Open the [Edge Add-ons Store](https://microsoftedge.microsoft.com/addons/MicrosoftEdge).
    2. Search for **Angular Signal DevTools**.
    3. Click **Get** to install the extension.

### 3. Enable the Extension
Once installed, ensure the extension is enabled in your browser:
1. Open your browser's extension settings.
2. Locate **Angular Signal DevTools** and ensure it is turned on.

---

## Using Angular Signal DevTools

Once installed, follow these steps to start debugging signals in your Angular app:

### 1. Run Your Angular Application
- Make sure your application is running locally or on a server.
- Open your app in the browser where the Signal DevTools extension is installed.

### 2. Open Developer Tools
- Press `F12` or right-click anywhere in your application and select **Inspect**.
- Navigate to the **Signals** tab in the developer tools.

### 3. Inspect Signals
- The Signals tab displays all the signals currently in your application.
- For each signal, you can:
    - **View Current Values**: Inspect the current value of the signal.
    - **Track Dependencies**: View how signals depend on or affect each other.
    - **Observe Updates**: Monitor changes to signal values in real time.

### 4. Debugging Tips
- Modify your application to trigger signal updates and watch the updates live in the Signals tab.
- Use computed signals and effects to see how dependencies are tracked and executed.

---

## Example
Here is a simple Angular signal example to test with the DevTools:

### Component Code
```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <h1>Counter: {{ count() }}</h1>
      <h2>Double: {{ doubleCount() }}</h2>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
    </div>
  `,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
      console.log('Double Count:', this.doubleCount());
    });
  }

  increment() {
    this.count.set(this.count() + 1);
  }

  decrement() {
    this.count.set(this.count() - 1);
  }
}
```

### Steps to Debug
1. Run the app and open the **Signals** tab in your browser's DevTools.
2. Interact with the app (e.g., click Increment/Decrement).
3. Watch the signals (`count` and `doubleCount`) update in real time.
4. Inspect the reactive dependencies between signals.

---

## Summary
Angular Signal DevTools makes it easy to debug and optimize your application's signals by providing clear insights into their values and dependencies. Install it today to simplify your development process!

