import {createFeatureSelector, createSelector} from '@ngrx/store';
import {TodoState} from "./todo.state";

export const selectTodoState = createFeatureSelector<TodoState>('todo');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state) => state.todos
);

export const selectAllTodosLoaded = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos.length > 0 // True if todos are already loaded
);

export const selectSelectedTodo = createSelector(
  selectTodoState,
  (state) => state.selectedTodo
);

export const selectLoading = createSelector(
  selectTodoState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectTodoState,
  (state) => state.error
);