import {Component, Signal, ViewEncapsulation} from '@angular/core';
import {Day} from "../../../model/clocking.model";
import {DatePipe} from "@angular/common";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {DailyTimeRecordsComponent} from "./daily-time-records/daily-time-records.component";
import {TimeRecordingComponent} from "./time-recording/time-recording.component";
import {TimeRecordingNavigationComponent} from "./time-recording-navigation/time-recording-navigation.component";
import {ClockingTrackingService} from "../../../services/clocking-tracking.service";
import {RecentTimeRecordsComponent} from "./recent-time-records/recent-time-records.component";
import {OpenDaysComponent} from "./open-days/open-days.component";

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  imports: [
    DatePipe,
    TableModule,
    FormsModule,
    DailyTimeRecordsComponent,
    TimeRecordingComponent,
    TimeRecordingNavigationComponent,
    RecentTimeRecordsComponent,
    OpenDaysComponent
  ],
  styleUrl: './time-tracking.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class TimeTrackingComponent {
  protected readonly selectedDay$: Signal<Day>;

  constructor(readonly trackingService: ClockingTrackingService) {
    this.selectedDay$ = trackingService.selectedDay$;
  }
}
