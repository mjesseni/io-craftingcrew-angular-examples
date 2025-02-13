# Using `effect(() => ...)` in Angular Signals: Best Practices

Angular's reactive signals introduce `effect(() => ...)`, a powerful tool for reacting to signal changes and triggering side effects. Unlike traditional approaches using RxJS subscriptions, `effect` integrates seamlessly with Angular's reactive context and lifecycle, offering a declarative and efficient way to handle state-dependent side effects.

---

## What is `effect(() => ...)`?

An `effect` is a reactive function that automatically executes whenever one of its dependent signals changes. It is used to handle side effects such as:

- Logging state changes
- Triggering API calls
- Updating external services

`effect` automatically tracks signal dependencies and manages the lifecycle of side effects, ensuring cleanup when the associated component or directive is destroyed.

---

## How to Use `effect`

Let’s take a **Todo List Component** as an example. Suppose we want to react to changes in the list of todos and log them, or trigger additional side effects like analytics or API calls.

```typescript
import { Component, Signal, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllTodos } from './todo.selectors';
import { Todo } from './todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    <ul>
      <li *ngFor="let todo of todos$()">{{ todo.title }}</li>
    </ul>
  `,
})
export class TodoListComponent {
  todos$: Signal<Todo[]> = this.store.selectSignal(selectAllTodos);

  constructor(private store: Store) {
    // Effect to log todos whenever they change
    effect(() => {
      console.log('Todos updated:', this.todos$());
    });
  }
}
```

### Key Points:
- **Signal Dependency Tracking:** `effect` automatically reacts when `this.todos$()` changes.
- **Lifecycle Management:** The `effect` is automatically disposed of when the component is destroyed.

---

## Best Practices for `effect`

### 1. **Keep Effects Focused on Side Effects**
Use `effect` for tasks like logging, API calls, or triggering external processes. Avoid using it to directly modify state, as this can lead to circular updates.

#### ✅ Good Example:
```typescript
effect(() => {
  console.log('Todos updated:', this.todos$());
});
```

#### ❌ Avoid This:
```typescript
effect(() => {
  this.todos$.set([...this.todos$(), { id: 'new', title: 'New Todo' }]); // Circular dependency
});
```

---

### 2. **Avoid Heavy Computations in Effects**
For derived or computed values, use `computed` signals instead of `effect`. This keeps effects focused on external side effects and improves performance.

#### ✅ Use `computed` for Derived Values:
```typescript
const incompleteTodos = computed(() => this.todos$().filter(todo => !todo.completed));
```

---

### 3. **Ensure Cleanup for External Resources**
If your effect interacts with external resources (e.g., subscribes to an `Observable` or starts a timer), ensure proper cleanup to avoid memory leaks.

#### Example with Cleanup:
```typescript
import { timer } from 'rxjs';

const timer$ = timer(0, 1000);
effect(() => {
  const subscription = timer$.subscribe(() => {
    console.log('Timer tick');
  });

  return () => subscription.unsubscribe(); // Cleanup on destroy
});
```

---

### 4. **Combine Signals and Effects Thoughtfully**
Use `effect` for reactive tasks and leave state transformation to `computed`. Overusing `effect` for tasks that don’t involve side effects can lead to unnecessary complexity.

#### ✅ Signal for Local UI State:
```typescript
const filterText = signal('');
const filteredTodos = computed(() => this.todos$().filter(todo => todo.title.includes(filterText())));
```

---

### 5. **Debugging Effects**
When debugging effects:
- Log the signal values explicitly to understand changes.
- Ensure you are not triggering unnecessary effects by overusing `effect` in situations where `computed` suffices.

#### Example:
```typescript
effect(() => {
  console.log('Filtered todos updated:', filteredTodos());
});
```

---

### 6. **Avoid Circular Dependencies**
Ensure that signals used inside an `effect` do not create a feedback loop by directly modifying their own state.

#### Example of a Circular Dependency (❌):
```typescript
effect(() => {
  this.todos$.set([...this.todos$(), { id: 'new', title: 'New Todo' }]); // Leads to a feedback loop
});
```

#### Corrected Example (✅):
```typescript
effect(() => {
  console.log('Todos updated:', this.todos$());
});
```

---

## Common Use Cases

### 1. **Logging State Changes**
```typescript
effect(() => {
  console.log('Todos updated:', this.todos$());
});
```

### 2. **Triggering API Calls**
```typescript
effect(() => {
  if (this.todos$().length > 0) {
    this.apiService.fetchTodoDetails(this.todos$()).subscribe((details) => {
      console.log('Todo details fetched:', details);
    });
  }
});
```

### 3. **Updating External Services**
```typescript
effect(() => {
  this.analyticsService.track('Todos Updated', this.todos$());
});
```

---

## Summary
- **Use `effect` for side effects:** React to signal changes to perform tasks like logging, API calls, or external updates.
- **Leverage Angular’s lifecycle management:** `effect` ensures cleanup automatically.
- **Prefer `computed` for state transformations:** Keep `effect` focused on external side effects.
- **Avoid circular dependencies:** Do not modify the signal being tracked within the same `effect`.

By following these best practices, you can fully leverage `effect` in Angular signals to create clean, efficient, and maintainable reactive applications.
