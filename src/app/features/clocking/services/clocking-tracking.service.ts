import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {ClockingTrackingState} from "../store/tracking/tracking.state";
import {
  navigateNextMonth,
  navigateNextWeek,
  navigatePreviousMonth,
  navigatePreviousWeek,
  selectTrackingDay
} from "../store/tracking/tracking.actions";
import {
  selectTrackingLoadingState,
  selectTrackingSelectedDay, selectTrackingSelectedMonth, selectTrackingSelectedWeek,
} from "../store/tracking/tracking.selectors";

@Injectable({providedIn: 'root'})
export class ClockingTrackingService {

  loading$ = this.trackingStore.selectSignal(selectTrackingLoadingState);
  selectedMonthDays$ = this.trackingStore.selectSignal(selectTrackingSelectedMonth);
  selectedWeekDays$ = this.trackingStore.selectSignal(selectTrackingSelectedWeek);
  selectedDay$ = this.trackingStore.selectSignal(selectTrackingSelectedDay);

  constructor(private readonly trackingStore: Store<ClockingTrackingState>) {
  }

  public dispatchSelectTrackingDay(date: Date) {
    this.trackingStore.dispatch(selectTrackingDay({day: date}));
  }

  public dispatchNavigateNextWeek() {
    this.trackingStore.dispatch(navigateNextWeek());
  }

  public dispatchNavigatePreviousWeek() {
    this.trackingStore.dispatch(navigatePreviousWeek());
  }

  public dispatchNavigateNextMonth() {
    this.trackingStore.dispatch(navigateNextMonth());
  }

  public dispatchNavigatePreviousMonth() {
    this.trackingStore.dispatch(navigatePreviousMonth());
  }
}
