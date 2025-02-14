# Adding Global Side Effects in NgRx: Reporting Errors to a Central Service

In NgRx applications, managing side effects is often a crucial aspect of handling asynchronous operations or error logging. Here's how you can set up global side effects to report errors to a central service.

## The Best Approach: Using NgRx Effects
NgRx Effects provide a robust and declarative way to handle side effects outside your components. Using Effects, you can centralize logic such as error reporting and ensure consistency across your application.

### Steps to Implement Global Error Reporting

1. **Create a Centralized Error Service**

   This service will act as the central logging mechanism where errors are sent for further analysis.

   ```typescript
   import { Injectable } from '@angular/core';

   @Injectable({
     providedIn: 'root',
   })
   export class ErrorLoggingService {
     reportError(error: any): void {
       console.error('Reporting error:', error);
       // Send the error to a central logging system (e.g., Sentry, custom backend)
     }
   }
   ```

2. **Update Effects to Report Errors**

   Modify your existing effects to ensure that all errors are logged through the ErrorLoggingService. Below is an updated example with global error reporting implemented:

   ```typescript
   import { Injectable } from '@angular/core';
   import { Actions, createEffect, ofType } from '@ngrx/effects';
   import { of, switchMap, withLatestFrom } from 'rxjs';
   import { catchError, filter, map, mergeMap } from 'rxjs/operators';
   import {
     actionSuccess,
     addTodo,
     deleteTodo,
     loadTodos,
     loadTodosFailure,
     loadTodosSuccess,
     selectTodo,
     selectTodoSuccess,
     updateTodo,
   } from './todo.actions';
   import { TodoService } from '../services/todo.service';
   import { Store } from '@ngrx/store';
   import { selectAllTodosLoaded } from './todo.selectors';
   import { routerNavigatedAction } from '@ngrx/router-store';
   import { ErrorLoggingService } from '../services/error-logging.service';

   @Injectable()
   export class TodoEffects {
     constructor(
       private actions$: Actions,
       private todoService: TodoService,
       private store: Store,
       private errorLoggingService: ErrorLoggingService
     ) {}

     loadTodosOnRouteChange$ = createEffect(() =>
       this.actions$.pipe(
         ofType(routerNavigatedAction),
         filter((action) => action.payload.routerState.url === '/todo/list'),
         map(() => loadTodos())
       )
     );

     loadTodos$ = createEffect(() =>
       this.actions$.pipe(
         ofType(loadTodos),
         mergeMap(() =>
           this.todoService.getTodos().pipe(
             map((todos) => loadTodosSuccess({ todos })),
             catchError((error) => {
               this.errorLoggingService.reportError(error);
               return of(loadTodosFailure({ error }));
             })
           )
         )
       )
     );

     addTodo$ = createEffect(() =>
       this.actions$.pipe(
         ofType(addTodo),
         mergeMap(({ todo }) =>
           this.todoService.addTodo(todo).pipe(
             map(() => actionSuccess()),
             catchError((error) => {
               this.errorLoggingService.reportError(error);
               return of(loadTodosFailure({ error }));
             })
           )
         )
       )
     );

     updateTodo$ = createEffect(() =>
       this.actions$.pipe(
         ofType(updateTodo),
         mergeMap(({ todo }) =>
           this.todoService.updateTodo(todo).pipe(
             map(() => actionSuccess()),
             catchError((error) => {
               this.errorLoggingService.reportError(error);
               return of(loadTodosFailure({ error }));
             })
           )
         )
       )
     );

     deleteTodo$ = createEffect(() =>
       this.actions$.pipe(
         ofType(deleteTodo),
         mergeMap(({ id }) =>
           this.todoService.deleteTodo(id).pipe(
             map(() => actionSuccess()),
             catchError((error) => {
               this.errorLoggingService.reportError(error);
               return of(loadTodosFailure({ error }));
             })
           )
         )
       )
     );

     selectTodo$ = createEffect(() =>
       this.actions$.pipe(
         ofType(selectTodo),
         withLatestFrom(this.store.select(selectAllTodosLoaded)),
         switchMap(([{ id }, todosLoaded]) => {
           if (!todosLoaded) {
             return this.todoService.getTodos().pipe(
               switchMap((todos) => [
                 loadTodosSuccess({ todos }),
                 selectTodoSuccess({ id }),
               ]),
               catchError((error) => {
                 this.errorLoggingService.reportError(error);
                 return of(loadTodosFailure({ error }));
               })
             );
           } else {
             return of(selectTodoSuccess({ id }));
           }
         })
       )
     );
   }
   ```

   By injecting the `ErrorLoggingService` and calling `reportError` within each `catchError` block, all errors are automatically reported to the central logging service.

3. **Advantages of This Approach**
    - **Consistency**: Every error in your application is handled uniformly.
    - **Centralized Reporting**: Errors are logged in one place, making debugging and monitoring easier.
    - **Reduced Boilerplate**: The `catchError` logic remains concise and reusable.

4. **Drawbacks of Relying on Local Component State**

   While it may be tempting to handle state and side effects locally in components, there are several drawbacks:

    - **Duplication of Logic**: Each component needs to implement similar error handling logic, leading to repetition and potential inconsistencies.
    - **Difficult Maintenance**: Updating or refactoring error handling logic requires changes in multiple places.
    - **Limited Reusability**: Logic confined to a single component cannot be easily reused elsewhere.
    - **Poor Scalability**: As the application grows, managing local state and side effects becomes increasingly complex.
    - **Testing Challenges**: Component-based error handling is harder to isolate and test compared to centralized approaches.

   ### When to Use Local Component State
   Local state is suitable for simple, isolated cases such as managing temporary UI states (e.g., toggling modals, loading spinners). For shared state or global side effects, prefer NgRx.

## Conclusion
Using NgRx Effects for global error reporting ensures a clean, scalable, and maintainable solution. Avoid relying solely on local component state for shared logic or side effects to maintain consistency and improve testability in your application.

