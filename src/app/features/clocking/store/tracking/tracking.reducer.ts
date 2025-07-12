import {createReducer, on} from '@ngrx/store';
import {ClockingTrackingState, initialClockingTrackingState} from "./tracking.state";
import {
  navigateNextMonth,
  navigateNextWeek,
  navigatePreviousMonth,
  navigatePreviousWeek,
  selectTrackingDay
} from "./tracking.actions";
import {dateToDay, getMonth, getWeek} from "../../clocking.utils";
import {addDays, addMonths} from "date-fns";

function setSelectedDay(state: ClockingTrackingState, day: Date) {
  return {
    ...state,
    tracking: {
      ...state.tracking,
      selectedDay: dateToDay(day),
      selectedWeekDays: getWeek(day),
      selectedMonthDays: getMonth(day),
    }
  }
}

export const trackingReducer = createReducer(
  initialClockingTrackingState,

  on(selectTrackingDay, (state: ClockingTrackingState, {day}) => {
    if (state.tracking.selectedDay.date !== day) {
      return setSelectedDay(state, day);
    }
    return state;
  }),

  on(navigateNextWeek, (state: ClockingTrackingState) => {
    const day = addDays(state.tracking.selectedDay.date, 7)
    return setSelectedDay(state, day);
  }),
  on(navigatePreviousWeek, (state: ClockingTrackingState) => {
    const day = addDays(state.tracking.selectedDay.date, -7)
    return setSelectedDay(state, day);
  }),

  on(navigateNextMonth, (state: ClockingTrackingState) => {
    const day = addMonths(state.tracking.selectedDay.date, 1)
    return setSelectedDay(state, day);
  }),
  on(navigatePreviousMonth, (state: ClockingTrackingState) => {
    const day = addMonths(state.tracking.selectedDay.date, -1)
    return setSelectedDay(state, day);
  })
);