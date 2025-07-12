import {Component, computed, Signal, signal} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {
  DailyRecordActionComponent
} from "../../../admin/clocking-approval/daily-record-action/daily-record-action.component";
import {
  DailyRecordStatusComponent
} from "../../../admin/clocking-approval/daily-record-status/daily-record-status.component";
import {DatePicker, DatePickerTypeView} from "primeng/datepicker";
import {NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {Ripple} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {ToggleButton} from "primeng/togglebutton";
import {Tooltip} from "primeng/tooltip";
import {formatTimeInMinutes} from "../../../../clocking.utils";
import {Day} from "../../../../model/clocking.model";
import {DailyRecordState} from "../../../../store/approval/approval.state";
import {isSameDay} from "date-fns";
import {FormsModule} from "@angular/forms";
import {ClockingTrackingService} from "../../../../services/clocking-tracking.service";

@Component({
  selector: 'app-time-recording-navigation',
  imports: [
    ButtonDirective,
    DailyRecordActionComponent,
    DailyRecordStatusComponent,
    DatePicker,
    NgIf,
    PrimeTemplate,
    Ripple,
    TableModule,
    ToggleButton,
    Tooltip,
    FormsModule
  ],
  templateUrl: './time-recording-navigation.component.html',
  styleUrl: './time-recording-navigation.component.scss'
})
export class TimeRecordingNavigationComponent {

  protected readonly formatTimeInMinutes = formatTimeInMinutes;

  protected readonly dailyRecords = signal<[{ records: DailyRecordState[] }]>([{
    records: []
  }]);
  protected readonly pickerMode$ = signal<DatePickerTypeView>('month');


  protected readonly selectedDay$: Signal<Day>;
  protected readonly selectedWeekDays$: Signal<Day[]>;
  protected readonly selectedMonth$ = computed(() => this.selectedDay$().date)
  protected readonly showWeekends$ = signal<boolean>(false);


  constructor(private readonly trackingService: ClockingTrackingService) {
    this.selectedDay$ = trackingService.selectedDay$;
    this.selectedWeekDays$ = trackingService.selectedWeekDays$;
  }

  protected onDaySelected(day: Day) {
    this.trackingService.dispatchSelectTrackingDay(day.date);
  }

  protected onKeyDown(evt: KeyboardEvent, day: Day) {
    this.onDaySelected(day);
  }

  protected onPrevMonth() {
    this.trackingService.dispatchNavigatePreviousMonth();
  }

  protected onNextMonth() {
    this.trackingService.dispatchNavigateNextMonth();
  }

  protected onNextWeek() {
    this.trackingService.dispatchNavigateNextWeek();
  }

  protected onPrevWeek() {
    this.trackingService.dispatchNavigatePreviousWeek();
  }

  protected onSelectMonth(month: Date) {
    this.trackingService.dispatchSelectTrackingDay(month);
  }

  protected readonly isSameDay = isSameDay;
}
