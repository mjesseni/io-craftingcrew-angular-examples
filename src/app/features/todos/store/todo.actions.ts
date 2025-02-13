import {createAction, props} from '@ngrx/store';
import {Todo} from '../model/todo.model';

// Load Todos
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success', props<{ todos: Todo[] }>()
);
export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure', props<{ error: any }>()
);

// Add Todo
export const addTodo = createAction(
  '[Todo] Add Todo', props<{ todo: Todo }>()
);

// Update Todo
export const updateTodo = createAction(
  '[Todo] Update Todo', props<{ todo: Todo }>()
);

// Delete Todo
export const deleteTodo = createAction(
  '[Todo] Delete Todo', props<{ id: string }>()
);

// Select Todo for Details
export const selectTodo = createAction(
  '[Todo] Select Todo', props<{ id: string }>()
);

export const selectTodoSuccess = createAction(
  '[Todo] Select Todo Success', props<{ id: string }>()
);