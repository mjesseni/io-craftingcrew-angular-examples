import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ClockingTrackingState} from "./tracking.state";

export const selectClockingTrackingState = createFeatureSelector<ClockingTrackingState>('clocking.tracking');

export const selectTrackingLoadingState = createSelector(
  selectClockingTrackingState,
  (state) => state.loading);


export const selectTrackingSelectedDay = createSelector(
  selectClockingTrackingState,
  (state) => state.tracking.selectedDay);

export const selectTrackingSelectedMonth = createSelector(
  selectClockingTrackingState,
  (state) => state.tracking.selectedMonthDays);

export const selectTrackingSelectedWeek = createSelector(
  selectClockingTrackingState,
  (state) => state.tracking.selectedWeekDays);