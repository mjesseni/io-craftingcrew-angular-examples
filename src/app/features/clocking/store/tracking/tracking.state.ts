import {Day} from "../../model/clocking.model";
import {dateToDay, getMonth, getWeek} from "../../clocking.utils";

export interface TrackingState {
  selectedDay: Day,
  selectedMonthDays: Day[],
  selectedWeekDays: Day[],
}

export interface ClockingTrackingState {
  loading: boolean;
  error: never | undefined;
  tracking: TrackingState
}

export const initialClockingTrackingState: ClockingTrackingState = {
  loading: false,
  error: undefined,
  tracking: {
    selectedDay: dateToDay(new Date()),
    selectedMonthDays: getMonth(new Date()),
    selectedWeekDays: getWeek(new Date())
  }
};