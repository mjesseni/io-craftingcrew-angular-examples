import {todoReducer} from './todo.reducer';
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
import {initialTodoState} from './todo.state';

describe('Todo Reducer', () => {
  it('should return the initial state when an unknown action is dispatched', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = todoReducer(undefined, action);
    expect(state).toEqual(initialTodoState);
  });

  it('should set loading to true when loadTodos is dispatched', () => {
    const action = loadTodos();
    const state = todoReducer(initialTodoState, action);
    expect(state.loading).toBe(true);
  });

  it('should set loading to false and update todos when loadTodosSuccess is dispatched', () => {
    const todos = [{id: '1', title: 'Test Todo', completed: false}];
    const action = loadTodosSuccess({todos});
    const state = todoReducer(initialTodoState, action);
    expect(state.loading).toBe(false);
    expect(state.todos).toEqual(todos);
  });

  it('should set loading to false and update error when loadTodosFailure is dispatched', () => {
    const error = 'Failed to load todos';
    const action = loadTodosFailure({error});
    const state = todoReducer(initialTodoState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should add a todo when addTodo is dispatched', () => {
    const todo = {id: '2', title: 'New Todo', completed: false};
    const action = addTodo({todo});
    const state = todoReducer(initialTodoState, action);
    expect(state.todos).toContainEqual(todo);
  });

  it('should update a todo when updateTodo is dispatched', () => {
    const initialState = {
      ...initialTodoState,
      todos: [{id: '1', title: 'Old Todo', completed: false}],
    };
    const updatedTodo = {id: '1', title: 'Updated Todo', completed: true};
    const action = updateTodo({todo: updatedTodo});
    const state = todoReducer(initialState, action);
    expect(state.todos).toContainEqual(updatedTodo);
  });

  it('should delete a todo when deleteTodo is dispatched', () => {
    const initialState = {
      ...initialTodoState,
      todos: [{id: '1', title: 'Test Todo', completed: false}],
    };
    const action = deleteTodo({id: '1'});
    const state = todoReducer(initialState, action);
    expect(state.todos).not.toContainEqual({id: '1', title: 'Test Todo', completed: false});
  });

  it('should set loading to true and clear selectedTodo when selectTodo is dispatched', () => {
    const action = selectTodo({id: '1'});
    const state = todoReducer(initialTodoState, action);
    expect(state.loading).toBe(true);
    expect(state.selectedTodo).toBeNull();
  });

  it('should set loading to false and update selectedTodo when selectTodoSuccess is dispatched', () => {
    const initialState = {
      ...initialTodoState,
      todos: [{id: '1', title: 'Test Todo', completed: false}],
    };
    const action = selectTodoSuccess({id: '1'});
    const state = todoReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.selectedTodo).toEqual({id: '1', title: 'Test Todo', completed: false});
  });

  it('should set loading to false when actionSuccess is dispatched', () => {
    const action = actionSuccess();
    const state = todoReducer(initialTodoState, action);
    expect(state.loading).toBe(false);
  });
});
