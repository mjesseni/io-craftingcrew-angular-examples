import {createAction, props} from '@ngrx/store';

const prefix = '[Clocking] [Tracking]';

export const clockingTrackingActionSuccess =
  createAction(`${prefix} Action Success`);

export const selectTrackingDay =
  createAction(`${prefix} Select day`, props<{ day: Date }>());

/**
 * Navigation actions
 */
export const navigateNextWeek =
  createAction(`${prefix} Navigate to next week`);
export const navigatePreviousWeek =
  createAction(`${prefix} Navigate to previous week`);
export const navigateNextMonth =
  createAction(`${prefix} Navigate to next month`);
export const navigatePreviousMonth =
  createAction(`${prefix} Navigate to previous month`);
export const navigateToMonth =
  createAction(`${prefix} Navigate to month`, props<{ day: Date }>());

