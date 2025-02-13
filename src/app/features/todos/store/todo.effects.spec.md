
# How the Effect is Triggered in the Test

## Test Overview

The test verifies that when a `routerNavigatedAction` is dispatched with the URL `/todo/list`, the `loadTodosOnRouteChange$` effect triggers and dispatches a `loadTodos` action.

---

## Breakdown of the Test

### 1. GIVEN: Simulating the `routerNavigatedAction`

```typescript
const routerAction = routerNavigatedAction({
  payload: {
    routerState: { url: '/todo/list' } as SerializedRouterStateSnapshot,
    event: {} as any,
  },
});
```

**What happens here?**

- A mock `routerNavigatedAction` is created, simulating a navigation event to `/todo/list`.
- The `payload` includes:
    - `routerState` containing the `url` (`/todo/list`).
    - `event`, which is mocked as an empty object for simplicity.

---

### 2. WHEN: Providing the Action Stream

```typescript
actions$ = of(routerAction);
```

**What happens here?**

- The `actions$` observable is set up to emit the `routerAction`.
- The `provideMockActions` utility, defined in the `beforeEach` setup, injects this `actions$` stream into the `TodoEffects` class.

---

### 3. The Effect Subscribes to `actions$`

```typescript
effects.loadTodosOnRouteChange$.subscribe((action) => {
 ... 
})
```

**What happens here?**

- The `loadTodosOnRouteChange$` effect subscribes to the `actions$` observable.
- The effect is designed to:
    - Listen for actions of type `routerNavigatedAction`.
    - Filter the actions to include only those where the URL matches `/todo/list`.

**Here’s the effect definition from the `TodoEffects` class:**

```typescript
loadTodosOnRouteChange$ = createEffect(() =>
  this.actions$.pipe(
    ofType(routerNavigatedAction), // Listens for router navigated actions
    filter(action => action.payload.routerState.url === '/todo/list'), // Filters for specific URL
    map(() => loadTodos()) // Dispatches the loadTodos action
  )
);
```

#### Steps Inside the Effect:
1. **`ofType(routerNavigatedAction)`**:
    - Ensures only `routerNavigatedAction` actions are processed by the effect.
2. **`filter(action => action.payload.routerState.url === '/todo/list')`**:
    - Filters out actions where the URL does not match `/todo/list`.
3. **`map(() => loadTodos())`**:
    - Transforms the action into a new `loadTodos` action to be dispatched.

---

### 4. THEN: Expecting the Effect's Output

```typescript
expect(action).toEqual(loadTodos());
```

**What happens here?**

- Once the effect processes the `routerAction`, it emits a new `loadTodos` action.
- The test asserts that the emitted action matches the expected `loadTodos` action.

---

## How the Effect is Triggered in the Test

Here’s the sequence of how the effect is triggered:

1. **The Test Provides Actions**:
    - The `actions$` observable is set up with the mock `routerAction`.

2. **The Effect Listens to `actions$`**:
    - The `loadTodosOnRouteChange$` effect subscribes to `actions$` and processes the mocked `routerAction`.

3. **Effect Processes the Action**:
    - The effect matches the action type (`routerNavigatedAction`).
    - It passes the filter condition for the URL `/todo/list`.
    - It maps the action to produce a new `loadTodos` action.

4. **Effect Emits a New Action**:
    - The `loadTodosOnRouteChange$` effect emits the `loadTodos` action as its output.

5. **Test Verifies the Emitted Action**:
    - The test subscribes to the effect’s observable and verifies that the output matches the expected `loadTodos` action.

---

## Diagram of the Flow

1. Test emits `routerAction` into `actions$`.

2. `loadTodosOnRouteChange$` subscribes to `actions$`.

3. Effect processes the action:

    - Matches `ofType(routerNavigatedAction)`.

    - Passes the `filter` for URL `/todo/list`.

    - Emits `loadTodos` action.

4. Test verifies the emitted action.
