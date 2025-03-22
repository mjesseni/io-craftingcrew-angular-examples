import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {Tooltip} from "primeng/tooltip";
import {DailyRecordState} from "../../../../store/clocking.state";
import {ApprovalStatus, Employee, WorkingStatus} from "../../../../model/clocking.model";
import {ClockingApprovalService} from "../../../../services/clocking-approval.service";

@Component({
  selector: 'app-daily-record-status',
  imports: [
    NgClass,
    Tooltip,
    NgIf
  ],
  templateUrl: './daily-record-status.component.html',
  styleUrl: './daily-record-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DailyRecordStatusComponent {
  record = input<DailyRecordState>();
  employee = input<Employee>();

  protected open = computed(() => (this.record()?.approvalStatus || ApprovalStatus.OPEN) === ApprovalStatus.OPEN);
  protected finished = computed(() => this.record()?.approvalStatus === ApprovalStatus.FINISHED);
  protected completed = computed(() => this.record()?.approvalStatus === ApprovalStatus.COMPLETED);
  protected approved = computed(() => this.record()?.approvalStatus === ApprovalStatus.APPROVED);

  protected working = computed(() => this.record()?.workingStatus === WorkingStatus.WORKING);
  protected holiday = computed(() => this.record()?.workingStatus === WorkingStatus.HOLIDAY);
  protected sick = computed(() => this.record()?.workingStatus === WorkingStatus.SICK);

  constructor(private readonly clockingService: ClockingApprovalService) {
  }

  /**
   * Advances the state of the daily record for the current employee.
   * If both the employee and the state\`s day are defined, it calls the clocking service
   * to set the daily record state for the employee.
   */
  protected onNextState() {
    this.clockingService.setDailyRecordState(this.employee(), this.record()?.day);
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onNextState();
    }
  }

  protected onClick(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onNextState();
  }
}
