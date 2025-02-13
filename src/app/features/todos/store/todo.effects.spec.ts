import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable, of, throwError} from 'rxjs';
import {TodoEffects} from './todo.effects';
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
import {TodoService} from '../services/todo.service';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {initialTodoState} from './todo.state';
import {routerNavigatedAction, SerializedRouterStateSnapshot} from '@ngrx/router-store';

describe('TodoEffects', () => {
  let actions$: Observable<any>;
  let effects: TodoEffects;
  let todoService: jest.Mocked<TodoService>;
  let store: MockStore;

  beforeEach(() => {
    // Mock TodoService using Jest
    const todoServiceMock: jest.Mocked<TodoService> = {
      getTodos: jest.fn(),
      addTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn(),
      todos: []
    };

    TestBed.configureTestingModule({
      providers: [
        TodoEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            todo: initialTodoState,
          },
        }),
        {provide: TodoService, useValue: todoServiceMock},
      ],
    });

    effects = TestBed.inject(TodoEffects);
    todoService = TestBed.inject(TodoService) as jest.Mocked<TodoService>;
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadTodos when navigating to /todo/list', (done) => {
    /**
     * GIVEN: A navigation to the /todo/list route.
     */
    const routerAction = routerNavigatedAction({
      payload: {
        routerState: {url: '/todo/list'} as SerializedRouterStateSnapshot,
        event: {} as any,
      },
    });

    actions$ = of(routerAction);

    /**
     * WHEN: The loadTodosOnRouteChange$ effect is triggered.
     */
    effects.loadTodosOnRouteChange$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the loadTodos action.
       */
      expect(action).toEqual(loadTodos());
      done();
    });
  });

  it('should dispatch loadTodosSuccess on successful loadTodos', (done) => {
    /**
     * GIVEN: A list of todos from the service.
     */
    const todos = [
      {id: '1', title: 'Test Todo 1', description: 'Description 1', completed: false},
    ];
    todoService.getTodos.mockReturnValue(of(todos));

    actions$ = of(loadTodos());

    /**
     * WHEN: The loadTodos$ effect is triggered.
     */
    effects.loadTodos$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the loadTodosSuccess action with the todos.
       */
      expect(action).toEqual(loadTodosSuccess({todos}));
      done();
    });
  });

  it('should dispatch loadTodosFailure on failed loadTodos', (done) => {
    /**
     * GIVEN: An error when fetching todos from the service.
     */
    const error = 'Failed to load todos';
    todoService.getTodos.mockReturnValue(throwError(() => error));

    actions$ = of(loadTodos());

    /**
     * WHEN: The loadTodos$ effect is triggered.
     */
    effects.loadTodos$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the loadTodosFailure action with the error.
       */
      expect(action).toEqual(loadTodosFailure({error}));
      done();
    });
  });

  it('should dispatch actionSuccess after successfully adding a todo', (done) => {
    /**
     * GIVEN: A todo to be added.
     */
    const todo = {id: '1', title: 'New Todo', description: 'Description 1', completed: false};
    todoService.addTodo.mockReturnValue(of(todo));

    actions$ = of(addTodo({todo}));

    /**
     * WHEN: The addTodo$ effect is triggered.
     */
    effects.addTodo$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the actionSuccess action.
       */
      expect(action).toEqual(actionSuccess());
      expect(todoService.addTodo).toHaveBeenCalledWith(todo);
      done();
    });
  });

  it('should dispatch actionSuccess after successfully updating a todo', (done) => {
    /**
     * GIVEN: A todo to be updated.
     */
    const todo = {id: '1', title: 'Updated Todo', description: 'Updated Description', completed: true};
    todoService.updateTodo.mockReturnValue(of(todo));

    actions$ = of(updateTodo({todo}));

    /**
     * WHEN: The updateTodo$ effect is triggered.
     */
    effects.updateTodo$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the actionSuccess action.
       */
      expect(action).toEqual(actionSuccess());
      expect(todoService.updateTodo).toHaveBeenCalledWith(todo);
      done();
    });
  });

  it('should dispatch actionSuccess after successfully deleting a todo', (done) => {
    /**
     * GIVEN: A todo ID to delete.
     */
    const id = '1';
    todoService.deleteTodo.mockReturnValue(of(id));

    actions$ = of(deleteTodo({id}));

    /**
     * WHEN: The deleteTodo$ effect is triggered.
     */
    effects.deleteTodo$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the actionSuccess action.
       */
      expect(action).toEqual(actionSuccess());
      expect(todoService.deleteTodo).toHaveBeenCalledWith(id);
      done();
    });
  });

  it('should dispatch selectTodoSuccess if todos are already loaded', (done) => {
    /**
     * GIVEN: Todos are already loaded.
     */
    store.overrideSelector('selectAllTodosLoaded', true);
    const id = '1';
    const todos = [{id: '1', title: 'Test Todo', description: 'Description 1', completed: false}];
    todoService.getTodos.mockReturnValue(of(todos));

    actions$ = of(selectTodo({id}));

    /**
     * WHEN: The selectTodo$ effect is triggered.
     */
    effects.selectTodo$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the selectTodoSuccess action.
       */
      expect(action).toEqual(selectTodoSuccess({id}));
      done();
    });
  });

  it('should dispatch loadTodosFailure if loading todos during selectTodo fails', (done) => {
    /**
     * GIVEN: Todos are not loaded and fetching them fails.
     */
    store.overrideSelector('selectAllTodosLoaded', false);
    const id = '1';
    const error = 'Failed to load todos';
    todoService.getTodos.mockReturnValue(throwError(() => error));

    actions$ = of(selectTodo({id}));

    /**
     * WHEN: The selectTodo$ effect is triggered.
     */
    effects.selectTodo$.subscribe((action) => {
      /**
       * THEN: The effect should dispatch the loadTodosFailure action.
       */
      expect(action).toEqual(loadTodosFailure({error}));
      done();
    });
  });
});
