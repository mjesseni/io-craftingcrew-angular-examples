import {Component, signal} from '@angular/core';
import {Card} from "primeng/card";
import {
  DailyRecordStatusComponent
} from "../../../admin/clocking-approval/daily-record-status/daily-record-status.component";
import {DatePipe} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {DailyRecordState} from "../../../../store/approval/approval.state";
import {ApprovalStatus} from "../../../../model/clocking.model";

@Component({
  selector: 'app-open-days',
  imports: [
    Card,
    DailyRecordStatusComponent,
    DatePipe,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './open-days.component.html',
  styleUrl: './open-days.component.scss'
})
export class OpenDaysComponent {
  protected readonly openDays$ = signal<DailyRecordState[]>([
    {
      date: new Date('2025-02-28'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.OPEN
    },
    {
      date: new Date('2025-02-26'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.FINISHED
    },
    {
      date: new Date('2025-02-23'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.OPEN
    },
    {
      date: new Date('2025-02-12'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.FINISHED
    },
    {
      date: new Date('2025-02-09'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.FINISHED
    },
    {
      date: new Date('2025-02-07'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.OPEN
    },
    {
      date: new Date('2025-02-04'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.OPEN
    },
    {
      date: new Date('2025-02-02'),
      day: {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
      approvalStatus: ApprovalStatus.OPEN
    }
  ]);
}
