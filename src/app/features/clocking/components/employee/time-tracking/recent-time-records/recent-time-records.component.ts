import {Component, signal} from '@angular/core';
import {Card} from "primeng/card";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {DailyRecordState} from "../../../../store/approval/approval.state";
import {ApprovalStatus} from "../../../../model/clocking.model";

@Component({
  selector: 'app-recent-time-records',
  imports: [
    Card,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './recent-time-records.component.html',
  styleUrl: './recent-time-records.component.scss'
})
export class RecentTimeRecordsComponent {
  protected readonly records$ = signal<DailyRecordState[]>([
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
