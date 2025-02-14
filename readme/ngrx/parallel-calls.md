## Performing Multiple REST Calls in Parallel in NgRx Effect

You can perform multiple REST calls in parallel within an NgRx Effect using the `forkJoin` or `combineLatest` operator from RxJS. Both operators are useful but behave differently, depending on your use case. This document provides detailed explanations and examples of each approach.

### Code Example: Using `forkJoin`

`forkJoin` waits for all observables to complete and emits their final values as a combined object. This is ideal when you have a set of observables (like HTTP calls) that you need to execute in parallel and use their results together.

```typescript
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MyService } from '../services/my-service.service';
import { loadData, loadDataSuccess, loadDataFailure } from '../actions/my.actions';

@Injectable()
export class MyEffects {
  constructor(private actions$: Actions, private myService: MyService) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData),
      mergeMap(() => 
        forkJoin({
          data1: this.myService.getData1(),
          data2: this.myService.getData2(),
          data3: this.myService.getData3(),
        }).pipe(
          map((responses) => {
            // Accessing the values of the observables
            const data1 = responses.data1;
            const data2 = responses.data2;
            const data3 = responses.data3;

            // Pass these values to the success action
            return loadDataSuccess({ 
              data1: data1, 
              data2: data2, 
              data3: data3 
            });
          }),
          catchError((error) => of(loadDataFailure({ error })))
        )
      )
    )
  );
}
```

### Alternative Code Example: Using `combineLatest`

`combineLatest` emits whenever any of the input observables emit a value, but it only starts emitting after all observables have emitted at least once. This is useful when the observables might emit continuously (e.g., streams) and you want to react to the latest combination of values.

```typescript
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of, combineLatest } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { MyService } from '../services/my-service.service';
import { loadData, loadDataSuccess, loadDataFailure } from '../actions/my.actions';

@Injectable()
export class MyEffects {
  constructor(private actions$: Actions, private myService: MyService) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData),
      mergeMap(() =>
        combineLatest([
          this.myService.getData1(),
          this.myService.getData2(),
          this.myService.getData3()
        ]).pipe(
          map(([data1, data2, data3]) => {
            // Combine the latest values from the observables
            return loadDataSuccess({ 
              data1: data1, 
              data2: data2, 
              data3: data3 
            });
          }),
          catchError((error) => of(loadDataFailure({ error })))
        )
      )
    )
  );
}
```

### Key Points

#### 1. **Parallel REST Calls with `forkJoin`**
- The `forkJoin` operator executes multiple REST calls in parallel.
- It waits for all observables to complete before emitting an object with their final responses.
- Example:
  ```typescript
  forkJoin({
    data1: this.myService.getData1(),
    data2: this.myService.getData2(),
    data3: this.myService.getData3()
  })
  ```
- Suitable for one-time completion tasks like HTTP calls.

#### 2. **What Happens with `forkJoin`**
- Each `getData` method returns an observable (e.g., an HTTP request).
- The `forkJoin` operator subscribes to all observables and waits for them to emit their final values and complete.
- Once complete, `forkJoin` emits an object containing the responses:
  ```typescript
  {
    data1: <value emitted by data1>,
    data2: <value emitted by data2>,
    data3: <value emitted by data3>
  }
  ```

#### 3. **Parallel REST Calls with `combineLatest`**
- The `combineLatest` operator emits whenever any observable emits a value but requires all observables to emit at least once before emitting the first combined value.
- Example:
  ```typescript
  combineLatest([
    this.myService.getData1(),
    this.myService.getData2(),
    this.myService.getData3()
  ])
  ```
- Suitable for scenarios where observables emit continuously (e.g., real-time streams or event-based systems).

#### 4. **What Happens with `combineLatest`**
- Initially, `combineLatest` waits for all observables to emit at least once.
- Once all observables have emitted, it emits an array containing the latest value from each observable.
- Every time any observable emits, `combineLatest` emits a new array with the updated value and the latest values from the other observables.

#### 5. **Error Handling**
- Use `catchError` to handle errors and dispatch a failure action:
  ```typescript
  catchError((error) => of(loadDataFailure({ error })))
  ```

#### 6. **Mapping Responses**
- Use `map` to transform the responses into a single action payload:
  ```typescript
  map(([data1, data2, data3]) => loadDataSuccess({ data1, data2, data3 }))
  ```

### Complete Actions

#### `actions/my.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';

export const loadData = createAction('[My Component] Load Data');
export const loadDataSuccess = createAction(
  '[My API] Load Data Success',
  props<{ data1: any; data2: any; data3: any }>()
);
export const loadDataFailure = createAction(
  '[My API] Load Data Failure',
  props<{ error: any }>()
);
```

### Service Example

#### `services/my-service.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyService {
  constructor(private http: HttpClient) {}

  getData1(): Observable<any> {
    return this.http.get('/api/data1');
  }

  getData2(): Observable<any> {
    return this.http.get('/api/data2');
  }

  getData3(): Observable<any> {
    return this.http.get('/api/data3');
  }
}
```

### Summary
- Use `forkJoin` to perform parallel REST calls and wait for all responses.
- Use `combineLatest` when you want to process the latest emitted values from observables continuously.
- Understand that `combineLatest` waits for all observables to emit at least once before emitting combined values.
- Map the combined responses into a single follow-up action.
- Handle errors gracefully with `catchError`.
- Choose the appropriate operator based on whether you need one-time results (`forkJoin`) or continuous updates (`combineLatest`).
