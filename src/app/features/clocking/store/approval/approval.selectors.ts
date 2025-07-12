import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ClockingApprovalState} from "./approval.state";

export const selectClockingState =
  createFeatureSelector<ClockingApprovalState>('clocking.approval');

export const selectLoadingState =
  createSelector(selectClockingState, (state) => state.loading);

export const selectApprovalState =
  createSelector(selectClockingState, (state) => state.approval);

export const selectTeams =
  createSelector(selectClockingState, (state) => state.teams);