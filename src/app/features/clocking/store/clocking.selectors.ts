import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ClockingState} from "./clocking.state";

export const selectClockingState = createFeatureSelector<ClockingState>('clocking');

export const selectLoadingState = createSelector(
  selectClockingState,
  (state) => state.loading);

export const selectApprovalState = createSelector(
  selectClockingState,
  (state) => state.approval
);

export const selectTeams = createSelector(
  selectClockingState,
  (state) => state.teams
);