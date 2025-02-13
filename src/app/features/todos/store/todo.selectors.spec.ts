import {selectAllTodos, selectAllTodosLoaded, selectError, selectLoading, selectSelectedTodo} from './todo.selectors';
import {TodoState} from './todo.state';

describe('Todo Selectors', () => {
  let initialState: TodoState;

  beforeEach(() => {
    initialState = {
      todos: [
        {id: '1', title: 'Test Todo 1', completed: false},
        {id: '2', title: 'Test Todo 2', completed: true},
      ],
      loading: false,
      error: null,
      selectedTodo: {id: '1', title: 'Test Todo 1', completed: false},
    };
  });

  it('should select all todos', () => {
    const result = selectAllTodos.projector(initialState);
    expect(result).toEqual(initialState.todos);
  });

  it('should return true for selectAllTodosLoaded when todos exist', () => {
    const result = selectAllTodosLoaded.projector(initialState);
    expect(result).toBe(true);
  });

  it('should return false for selectAllTodosLoaded when no todos exist', () => {
    const emptyState = {...initialState, todos: []};
    const result = selectAllTodosLoaded.projector(emptyState);
    expect(result).toBe(false);
  });

  it('should select the selectedTodo', () => {
    const result = selectSelectedTodo.projector(initialState);
    expect(result).toEqual(initialState.selectedTodo);
  });

  it('should select the loading state', () => {
    const result = selectLoading.projector(initialState);
    expect(result).toBe(false);

    const loadingState = {...initialState, loading: true};
    const loadingResult = selectLoading.projector(loadingState);
    expect(loadingResult).toBe(true);
  });

  it('should select the error state', () => {
    const errorState = {...initialState, error: 'Error occurred'};
    const result = selectError.projector(errorState);
    expect(result).toBe('Error occurred');

    const noErrorResult = selectError.projector(initialState);
    expect(noErrorResult).toBeNull();
  });
});
