import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {todoReducer} from "./store/todo.reducer";
import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {TodoEffects} from "./store/todo.effects";

export const provideTodoFeature = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideStore({todo: todoReducer}),
    provideEffects([TodoEffects]),
  ]);
};