import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgIf} from "@angular/common";
import {DailyRecordState} from "../../../../store/clocking.state";
import {ApprovalStatus, Employee, WorkingStatus} from "../../../../model/clocking.model";
import {ClockingService} from "../../../../services/clocking.service";

@Component({
  selector: 'app-daily-record-action',
  imports: [
    NgIf
  ],
  templateUrl: './daily-record-action.component.html',
  styleUrl: './daily-record-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyRecordActionComponent {
  record = input<DailyRecordState>();
  employee = input<Employee>();

  protected open = computed(() => this.record()?.approvalStatus === ApprovalStatus.OPEN);
  protected completed = computed(() => this.record()?.approvalStatus === ApprovalStatus.COMPLETED);
  protected approved = computed(() => this.record()?.approvalStatus === ApprovalStatus.APPROVED);

  protected working = computed(() => this.record()?.workingStatus === WorkingStatus.WORKING);
  protected holiday = computed(() => this.record()?.workingStatus === WorkingStatus.HOLIDAY);
  protected sick = computed(() => this.record()?.workingStatus === WorkingStatus.SICK);

  constructor(private readonly clockingService: ClockingService) {
  }

  protected onComplete(event: Event) {
    event.preventDefault();
    this.clockingService.completeDailyRecord(this.employee(), this.record()?.day);
  }

  protected onApprove(event: Event) {
    event.preventDefault();
    this.clockingService.approveDailyRecord(this.employee(), this.record()?.day);
  }

  protected onReopen(event: Event) {
    event.preventDefault();
    this.clockingService.reopenDailyRecord(this.employee(), this.record()?.day);
  }
}
