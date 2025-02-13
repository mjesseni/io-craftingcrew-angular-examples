import {Todo} from "../model/todo.model";
import {provideRouter} from "@angular/router";
import {todoRoutes} from "../components/todo/todo.routes";
import {provideStore} from "@ngrx/store";
import {todoReducer} from "./todo.reducer";
import {provideEffects} from "@ngrx/effects";
import {TodoEffects} from "./todo.effects";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {environment} from "../../../../environments/environment";

export interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: any;
}

export const initialTodoState: TodoState = {
  todos: [],
  selectedTodo: null,
  loading: false,
  error: null,
};

export class TodoStateService {
  static forFeature() {
    return [
      provideRouter(todoRoutes),
      provideStore({todo: todoReducer}),
      provideEffects([TodoEffects]),
      provideStoreDevtools({
        maxAge: 25,
        logOnly: environment.production,
      }),
    ];
  }
}