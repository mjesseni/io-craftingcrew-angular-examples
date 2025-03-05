import {Component, computed, input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {ApprovalStatus, WorkingStatus} from "../../../../model/clocking.model";
import {DailyRecordState, Employee} from "../../../../store/clocking.state";
import {formatTimeInMinutes} from "../../../../clocking.utils";
import {ClockingService} from "../../../../services/clocking.service";

@Component({
  selector: 'app-daily-record-cell',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './daily-record-cell.component.html',
  styleUrl: './daily-record-cell.component.scss'
})
export class DailyRecordCellComponent {

  employee = input<Employee>();
  state = input<DailyRecordState>();

  /* computed signals */
  protected weekendDay = computed(() => this.state()?.day.weekend || false);
  protected workedTimeDisplay = computed(() => '+' + this.formatTime(this.state()?.workedTimeMinutes || 0));
  protected overTime = computed(() => this.getOvertime(this.state()) > 0);
  protected overTimeDisplay = computed(() => this.getOvertimeDisplay(this.state()));
  protected shortTime = computed(() => this.getShortTime(this.state()) > 0);
  protected shortTimeDisplay = computed(() => this.getShortTimeDisplay(this.state()));
  protected bookedTimeDisplay = computed(() => this.getBookedTimeDisplay(this.state()));

  /* approval status */
  protected open = computed(() => this.state()?.approvalStatus === ApprovalStatus.OPEN);
  protected completed = computed(() => this.state()?.approvalStatus === ApprovalStatus.COMPLETED);
  protected approved = computed(() => this.state()?.approvalStatus === ApprovalStatus.APPROVED);

  /* working status */
  protected working = computed(() => this.state()?.workingStatus === WorkingStatus.WORKING);
  protected holiday = computed(() => this.state()?.workingStatus === WorkingStatus.HOLIDAY);
  protected sick = computed(() => this.state()?.workingStatus === WorkingStatus.SICK);

  constructor(private readonly clockingService: ClockingService) {
  }

  protected getOvertime(state: DailyRecordState | undefined) {
    const workedTime = state?.workedTimeMinutes || 0;
    const normalTime = state?.normalTimeMinutes || 0;
    return workedTime > normalTime ? workedTime - normalTime : 0;
  }

  protected getOvertimeDisplay(state: DailyRecordState | undefined) {
    return '+' + this.formatTime(this.getOvertime(state));
  }

  protected getShortTime(state: DailyRecordState | undefined) {
    const workedTime = state?.workedTimeMinutes || 0;
    const normalTime = state?.normalTimeMinutes || 0;
    return workedTime < normalTime ? normalTime - workedTime : 0;
  }

  protected getShortTimeDisplay(state: DailyRecordState | undefined) {
    return '-' + this.formatTime(this.getShortTime(state));
  }

  protected getBookedTimeDisplay(state: DailyRecordState | undefined) {
    const bookedTime = state?.bookedTimeMinutes || 0;
    return bookedTime > 0 ? '+' + this.formatTime(bookedTime) : '';
  }

  protected formatTime(timeInMinutes: number) {
    return formatTimeInMinutes(timeInMinutes);
  }

  /**
   * Advances the state of the daily record for the current employee.
   * If both the employee and the state\`s day are defined, it calls the clocking service
   * to set the daily record state for the employee.
   */
  protected onNextState() {
    this.clockingService.setDailyRecordState(this.employee(), this.state()?.day);
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onNextState();
    }
  }

  protected onClick() {
    this.onNextState();
  }

  protected onComplete(event: Event) {
    event.preventDefault();
    this.clockingService.completeDailyRecord(this.employee(), this.state()?.day);
  }

  protected onApprove(event: Event) {
    event.preventDefault();
    this.clockingService.approveDailyRecord(this.employee(), this.state()?.day);
  }

  protected onReopen(event: Event) {
    event.preventDefault();
    this.clockingService.reopenDailyRecord(this.employee(), this.state()?.day);
  }
}
