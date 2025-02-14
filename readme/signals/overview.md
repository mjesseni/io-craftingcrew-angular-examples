# Angular Signals

## Introduction to Angular Signals
Angular Signals are a state management solution introduced in Angular to provide a simpler, reactive programming model for building web applications. Signals aim to improve performance, readability, and maintainability by offering a more predictable and intuitive way of handling state changes.

### What are Signals?
**Signals in Angular are reactive primitives used to manage and update state efficiently.** Unlike RxJS Observables, which rely on streams and subscriptions, **Signals are synchronous, self-contained, and automatically track dependencies for optimal reactivity.**

Signals allow developers to write less code compared to traditional reactive programming paradigms. They work natively within Angular's change detection system, improving app performance by minimizing unnecessary updates.

---

## Types of Signals

### 1. **Standalone Signals** (Introduced in Angular 16)
**Standalone signals are the most basic type of signal, representing a reactive value that triggers updates when changed.**

#### Example:
```typescript
import { signal } from '@angular/core';

const count = signal(0);

// Reading the value
console.log(count()); // 0

// Updating the value
count.set(1);
console.log(count()); // 1

// Incrementing the value
count.update((value) => value + 1);
console.log(count()); // 2
```

#### When to Use:
- For managing small, independent pieces of state.

---

### 2. **Computed Signals** (Introduced in Angular 16)
**Computed signals derive their values from other signals, re-evaluating automatically whenever dependencies change.**

#### Example:
```typescript
import { signal, computed } from '@angular/core';

const price = signal(100);
const quantity = signal(2);

// Computed signal
const total = computed(() => price() * quantity());

console.log(total()); // 200

// Updating the base signals updates the computed signal automatically
price.set(150);
console.log(total()); // 300
```

#### When to Use:
- To derive state from other signals.
- For complex, derived state that depends on multiple reactive values.

---

### 3. **Effects** (Introduced in Angular 16)
**Effects allow you to perform side effects whenever a signal changes, automatically tracking dependencies and re-running when necessary.**

#### Example:
```typescript
import { signal, effect } from '@angular/core';

const count = signal(0);

// Effect
effect(() => {
  console.log(`Count is now: ${count()}`);
});

// Updating the signal triggers the effect
count.set(5); // Logs: "Count is now: 5"
```

#### When to Use:
- To trigger side effects like logging, HTTP calls, or DOM updates when signals change.

---

### 4. **Linked Signals** (Introduced in Angular 16)
**Linked signals establish relationships between signals, keeping them in sync and ensuring consistent updates.**

#### Example:
```typescript
import { signal, linkedSignal } from '@angular/core';

const firstName = signal('John');
const lastName = signal('Doe');

// Linked signal
const fullName = linkedSignal({
  read: () => `${firstName()} ${lastName()}`,
  write: (value: string) => {
    const [first, last] = value.split(' ');
    firstName.set(first);
    lastName.set(last);
  }
});

console.log(fullName()); // "John Doe"

// Update full name
fullName.set('Jane Smith');
console.log(firstName()); // "Jane"
console.log(lastName()); // "Smith"
```

#### When to Use:
- When signals need to maintain a two-way relationship or synchronized state.
- For managing complex reactive relationships between multiple signals.

---

## New Updates in Angular 19 for Signals
**Angular 19 introduced several significant enhancements to Signals, making them more powerful and easier to use.** Here are some of the key updates:

### 1. **Signal Debugging Tools**
Angular 19 added built-in debugging tools for signals. Developers can now inspect signals and their dependencies directly in the browser’s developer tools, making it easier to track state changes and diagnose issues.

### 2. **Improved Type Inference**
Signals now offer better type inference, reducing the need for explicit type annotations. This simplifies the developer experience while maintaining strong type safety.

### 3. **Integration with Zone-Less Applications**
Signals are now fully compatible with zone-less Angular applications, enabling better performance and more predictable state updates.

### 4. **Batch Updates**
Angular 19 introduces the ability to batch multiple signal updates into a single change detection cycle, reducing the number of re-renders and improving performance in applications with complex state.

#### Example:
```typescript
import { signal, batch } from '@angular/core';

const count1 = signal(0);
const count2 = signal(0);

batch(() => {
  count1.set(5);
  count2.set(10);
});

console.log(count1()); // 5
console.log(count2()); // 10
```

---

## Interoperability Between Signals and RxJS
Signals can be integrated with RxJS Observables to allow interoperability between Angular’s reactive primitives and RxJS’s streams. You can convert between the two using helper functions.

### Converting an Observable to a Signal
You can convert an Observable to a Signal using Angular’s `toSignal` function.

#### Example:
```typescript
import { toSignal } from '@angular/core';
import { interval } from 'rxjs';

const observable$ = interval(1000);
const timeSignal = toSignal(observable$);

console.log(timeSignal()); // Updates every second
```

### Converting a Signal to an Observable
Signals can also be converted back to Observables using the `toObservable` function from Angular’s RxJS interop utilities. The `toObservable` function automatically manages subscriptions, ensuring that no memory leaks occur by unsubscribing when the source signal is no longer needed.

#### Example:
```typescript
import { signal } from '@angular/core';
import { toObservable } from 'rxjs-interop';

const count = signal(0);
const count$ = toObservable(count);

count$.subscribe(value => console.log(value));

count.set(5); // Logs: 5
```

### Memory Management Note:
**When using `toObservable`, Angular automatically handles the cleanup process, ensuring observables unsubscribe to prevent memory leaks, making it a safe choice for integrating signals with RxJS.**

---

## Migrating from RxJS to Signals
**Migrating from RxJS Observables to Signals involves replacing Observables with Signals in areas where state management is needed, significantly simplifying the reactive programming model.** Follow these steps:

1. **Identify Stateful Observables:**
    - Replace Observables managing local state with standalone signals.

2. **Replace Derived Observables:**
    - Use computed signals to replace Observables that derive state from other Observables.

3. **Handle Side Effects:**
    - Replace `subscribe` calls or effectful Observables with Angular Effects.

### Example Migration:
#### RxJS Approach:
```typescript
import { BehaviorSubject } from 'rxjs';

const count$ = new BehaviorSubject(0);
count$.subscribe(value => console.log(value));
count$.next(5);
```

#### Migrated to Signals:
```typescript
import { signal, effect } from '@angular/core';

const count = signal(0);
effect(() => console.log(count()));
count.set(5);
```

---

## Advantages of Signals Compared to RxJS
1. **Simplicity:** Signals are easier to understand and use, especially for beginners.
2. **Automatic Dependency Tracking:** Signals automatically track dependencies, reducing boilerplate code.
3. **Improved Performance:** Signals are synchronous and optimized for change detection, resulting in faster updates.
4. **Predictable State Management:** Signals provide a clear and predictable state management model.
5. **Reduced Boilerplate:** No need for manual subscriptions or cleanup logic.
6. **Enhanced Debugging:** Tools in Angular 19 improve visibility into signal behavior.

---

## Signals and NgRx: Working Together
Signals and NgRx can complement each other in large-scale Angular applications. While Signals are excellent for managing local and component-level state, NgRx is designed for centralized, feature-based state management and predictable state handling at the application level.

### When to Use Signals
- **Local State Management:** Use Signals when you need to manage state that is local to a component or a small set of components. Examples include form inputs, toggles, counters, and local UI states.
- **Lightweight State Needs:** For smaller apps or features that don’t require centralized state management, Signals provide a simpler and more performant solution.

### When to Use NgRx
- **Feature Store State Management:** Use NgRx for managing complex state shared across multiple components or features. Examples include user authentication state, application-wide settings, or data fetched from APIs.
- **Predictable State Updates:** NgRx provides immutability and predictable state transitions via actions and reducers, making it ideal for apps where traceability is important.
- **Complex State Sharing:** If state must be shared across unrelated components or modules, NgRx is often a better fit.

### Integrating Signals with NgRx
You can combine Signals with NgRx by using selectors and effects to provide reactive data to Signals. For example, you can convert an NgRx selector into a Signal for use in a component.

#### Example: Using Signals with NgRx Selectors
```typescript
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core';
import { selectFeatureState } from './state/selectors';

@Component({
  selector: 'app-feature',
  template: `
    <div>{{ featureState() }}</div>
  `
})
export class FeatureComponent {
  featureState = toSignal(this.store.select(selectFeatureState));

  constructor(private store: Store) {}
}
```

### Best Practices for Combining Signals and NgRx
1. **Use Signals for Local, Ephemeral State:** Manage local component state using Signals instead of adding unnecessary complexity to NgRx.
2. **Leverage NgRx for Shared State:** Reserve NgRx for feature-wide or app-wide state that needs immutability and traceability.
3. **Bridge Signals and NgRx Using Selectors:** Convert NgRx selectors into Signals using `toSignal()` for a seamless combination of the two approaches.
4. **Keep Responsibilities Clear:** Avoid mixing local Signal-based state and global NgRx state in a single component unless absolutely necessary.

---

## Best Practices

### 1. **Use Signals for Local State Management**
- Use standalone signals for managing component-local or small, independent pieces of state.

### 2. **Prefer Computed Signals Over Manual Updates**
- Leverage computed signals for derived states to reduce code duplication and ensure automatic updates.

### 3. **Handle Side Effects with Effects**
- Avoid performing side effects directly in signal updates. Use Angular effects for better separation of concerns and cleaner code.

### 4. **Batch Updates for Complex State Changes**
- Use `batch` updates when multiple state changes need to be applied together to improve performance and reduce re-renders.

### 5. **Debug Efficiently with Tools**
- Take advantage of the debugging tools introduced in Angular 19 to inspect signals and dependencies during development.

### 6. **Avoid Overusing Signals**
- Use signals where reactivity is necessary. Avoid adding signals unnecessarily to keep the code simple.

---

## Migrating a Large Application from RxJS to Signals

Migrating a large RxJS-based application to Signals requires a phased approach. Here’s how you can handle the migration effectively:

### Step 1: **Audit Current State Management**
- Identify all areas where RxJS is used for state management. Categorize Observables into:
    - Local stateful Observables
    - Derived Observables
    - Observables used for side effects

### Step 2: **Migrate Local Stateful Observables**
- Replace `BehaviorSubject` or `ReplaySubject` with standalone signals.

#### Example:
```typescript
// Before: RxJS
const state$ = new BehaviorSubject<number>(0);
state$.next(1);

// After: Signals
const state = signal(0);
state.set(1);
```

### Step 3: **Migrate Derived Observables**
- Replace derived Observables with computed signals.

#### Example:
```typescript
// Before: RxJS
const derived$ = state$.pipe(map((value) => value * 2));

// After: Signals
const derived = computed(() => state() * 2);
```

### Step 4: **Replace Subscriptions with Effects**
- Replace manual subscriptions with Angular effects.

#### Example:
```typescript
// Before: RxJS
state$.subscribe(value => console.log(value));

// After: Signals
const stateEffect = effect(() => console.log(state()));
```

### Step 5: **Gradual Integration**
- Migrate one module or feature at a time. Test thoroughly after each migration step.

### Step 6: **Refactor and Optimize**
- Use debugging tools and batch updates to optimize performance.

### Step 7: **Educate the Team**
- Ensure all developers are familiar with Signals to maintain consistency and avoid misuse.

---

## Conclusion
Angular Signals provide a powerful and efficient way to manage state in Angular applications. By following best practices and taking a phased approach to migration, you can simplify your application’s state management, improve performance, and enhance maintainability.

Explore Signals to transform your Angular applications and unlock new possibilities for reactivity!

