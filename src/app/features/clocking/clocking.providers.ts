import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {provideStore} from "@ngrx/store";
import {provideEffects} from "@ngrx/effects";
import {approvalReducer} from "./store/approval/approval.reducer";
import {ApprovalEffects} from "./store/approval/approval.effects";
import {trackingReducer} from "./store/tracking/tracking.reducer";

export const provideClockingFeatureStore = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideStore({
      'clocking.approval': approvalReducer,
      'clocking.tracking': trackingReducer
    }),
    provideEffects([ApprovalEffects]),
  ]);
};