# Unwanted Effects of Not Unsubscribing from an Observable in Angular

When you do not unsubscribe from an Observable in Angular, especially one tied to **central state** or shared resources, it can lead to several **unwanted effects**:

---

## 1. **Memory Leaks**
- Subscriptions remain active if not unsubscribed, preventing garbage collection.
- Over time, unused subscriptions accumulate, leading to:
    - **Memory bloat**.
    - Performance degradation.
- This is particularly problematic for components that are frequently created and destroyed, such as those in dynamic routing.

---

## 2. **Duplicate Subscriptions**
- If a component is recreated (e.g., through navigation) without unsubscribing, duplicate subscriptions are created.
- This can result in:
    - **Duplicate operations**, such as:
        - Redundant HTTP requests.
        - Multiple state updates.
    - **Inconsistent UI behavior**, where the same action is executed multiple times.

---

## 3. **Performance Issues**
- Unnecessary subscriptions lead to:
    - Extra computational overhead.
    - Increased CPU usage, especially for Observables emitting frequent updates (e.g., timers or streams).
- This can slow down your app and degrade the user experience.

---

## 4. **Unwanted Side Effects**
- Observables often trigger side effects like:
    - Updating the UI.
    - Executing logic.
- Active subscriptions tied to destroyed components can cause:
    - **Invalid UI updates**.
    - Side effects occurring when they are no longer relevant.

---

## 5. **Lifecycle and Context Mismatches**
- Active subscriptions from destroyed components may:
    - Reference outdated state, causing **runtime errors**.
    - Execute actions in contexts where they are no longer applicable, leading to unexpected behavior.

---

# Best Practices to Avoid These Issues

### 1. **Use the `AsyncPipe`**
- Bind Observables to templates with the `async` pipe. It automatically unsubscribes when the component is destroyed.

```html
<div *ngIf="data$ | async as data">
  {{ data }}
</div>
```

---

### 2. **Unsubscribe Manually**
- For Observables subscribed to in code, unsubscribe explicitly in the `OnDestroy` lifecycle hook:

```typescript
private subscription: Subscription;

ngOnInit() {
  this.subscription = this.observable$.subscribe(data => {
    // Do something
  });
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

---

### 3. **Use RxJS Operators**
- Use operators like `take`, `takeUntil`, or `first` to manage the subscription lifecycle:

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.observable$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // Do something
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

### 4. **Leverage State Management Tools**
- Use libraries like **NgRx** or **Akita** to manage centralized state.
    - These tools provide store Observables that do not require manual unsubscription.

---

By following these practices, you can prevent issues like memory leaks, redundant operations, and performance bottlenecks, ensuring a robust and maintainable Angular application.

