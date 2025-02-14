## Performing Multiple REST Calls in Parallel in NgRx Effect

You can perform multiple REST calls in parallel within an NgRx Effect using the `forkJoin` operator from RxJS. This ensures all requests are completed before proceeding and allows you to pass all responses to a follow-up action.

### Code Example

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

### Key Points

#### 1. **Parallel REST Calls**
- The `forkJoin` operator executes multiple REST calls in parallel.
- It waits for all observables to complete before emitting an object with all responses.
- Example:
  ```typescript
  forkJoin({
    data1: this.myService.getData1(),
    data2: this.myService.getData2(),
    data3: this.myService.getData3()
  })
  ```

#### 2. **What Happens**
- Each of the `getData` methods returns an observable (e.g., a result of an HTTP request).
- The `forkJoin` operator subscribes to all the observables.
- When all observables emit their final values and complete, `forkJoin` emits an object containing the values:
  ```typescript
  {
    data1: <value emitted by data1>,
    data2: <value emitted by data2>,
    data3: <value emitted by data3>
  }
  ```
- The emitted values are accessible via the keys (`data1`, `data2`, `data3`). These are the actual responses from the REST calls, not observables anymore.

#### 3. **Error Handling**
- Use `catchError` to handle errors and dispatch a failure action:
  ```typescript
  catchError((error) => of(loadDataFailure({ error })))
  ```

#### 4. **Mapping Responses**
- Once all REST calls are completed, `map` the responses into a single action payload:
  ```typescript
  map((responses) => loadDataSuccess({ data1: responses.data1, data2: responses.data2, data3: responses.data3 }))
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
- Map the combined responses into a single follow-up action.
- Handle errors gracefully with `catchError`.
- This ensures all REST calls are executed in parallel, and their responses are collected efficiently.
