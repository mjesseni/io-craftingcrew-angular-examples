import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {clockingReducer} from "./store/clocking.reducer";
import {ClockingEffects} from "./store/clocking.effects";

export const provideClockingFeatureStore = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideStore({clocking: clockingReducer}),
    provideEffects([ClockingEffects]),
  ]);
};