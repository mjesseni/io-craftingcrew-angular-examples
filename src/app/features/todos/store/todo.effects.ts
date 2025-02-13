import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of, switchMap, withLatestFrom} from 'rxjs';
import {catchError, filter, map, mergeMap} from 'rxjs/operators';
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
import {TodoService} from "../services/todo.service";
import {Store} from "@ngrx/store";
import {selectAllTodosLoaded} from "./todo.selectors";
import {routerNavigatedAction} from "@ngrx/router-store";

@Injectable()
export class TodoEffects {
  constructor(private actions$: Actions, private todoService: TodoService, private store: Store) {
  }

  loadTodosOnRouteChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction), // This comes from @ngrx/router-store
      filter(action => action.payload.routerState.url === '/todo/list'),
      map(() => loadTodos())
    )
  );

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      mergeMap(() =>
        this.todoService.getTodos().pipe(
          map((todos) => loadTodosSuccess({todos})),
          catchError((error) => of(loadTodosFailure({error})))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTodo),
      mergeMap(({todo}) =>
        this.todoService.addTodo(todo).pipe(
          map(() => actionSuccess()), // Refresh todos after adding
          catchError((error) => of(loadTodosFailure({error})))
        )
      )
    )
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTodo),
      mergeMap(({todo}) =>
        this.todoService.updateTodo(todo).pipe(
          map(() => actionSuccess()), // Refresh todos after updating
          catchError((error) => of(loadTodosFailure({error})))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTodo),
      mergeMap(({id}) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => actionSuccess()), // Refresh todos after deleting
          catchError((error) => of(loadTodosFailure({error})))
        )
      )
    )
  );

  selectTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectTodo),
      withLatestFrom(this.store.select(selectAllTodosLoaded)),
      switchMap(([{id}, todosLoaded]) => {
        if (!todosLoaded) {
          // Dispatch loadTodos if todos are not yet loaded
          return this.todoService.getTodos().pipe(
            switchMap((todos) => [
              loadTodosSuccess({todos}),
              selectTodoSuccess({id})
            ]),
            catchError((error) => of(loadTodosFailure({error})))
          );
        } else {
          // Todos are already loaded, dispatch selectTodoSuccess directly
          return of(selectTodoSuccess({id}));
        }
      })
    )
  );

}