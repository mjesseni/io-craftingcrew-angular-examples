import {createReducer, on} from '@ngrx/store';
import {
  addTodo,
  deleteTodo,
  loadTodos,
  loadTodosFailure,
  loadTodosSuccess,
  selectTodo, selectTodoSuccess,
  updateTodo,
} from './todo.actions';
import {initialTodoState} from "./todo.state";

export const todoReducer = createReducer(
  initialTodoState,
  on(loadTodos, (state) => ({...state, loading: true})),
  on(loadTodosSuccess, (state, {todos}) => ({
    ...state,
    loading: false,
    todos,
  })),
  on(loadTodosFailure, (state, {error}) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addTodo, (state, {todo}) => ({
    ...state,
    todos: [...state.todos, todo],
  })),
  on(updateTodo, (state, {todo}) => ({
    ...state,
    todos: state.todos.map((t) => (t.id === todo.id ? todo : t)),
  })),
  on(deleteTodo, (state, {id}) => ({
    ...state,
    todos: state.todos.filter((t) => t.id !== id),
  })),
  on(selectTodoSuccess, (state, { id }) => ({
    ...state,
    selectedTodo: state.todos.find((t) => t.id === id) || null,
  }))
);