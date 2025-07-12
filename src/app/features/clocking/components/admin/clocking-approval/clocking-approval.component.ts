import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  model,
  OnDestroy,
  Signal,
  signal,
  ViewChild
} from '@angular/core';
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import { NgClass } from "@angular/common";
import {addDays, endOfMonth, startOfMonth} from "date-fns";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {FormsModule} from "@angular/forms";
import {DatePicker, DatePickerTypeView} from "primeng/datepicker";
import {ApprovalStatus, Day, Team} from "../../../model/clocking.model";
import {ClockingApprovalService} from "../../../services/clocking-approval.service";
import {EmployeeApprovalState} from "../../../store/approval/approval.state";
import {formatTimeInMinutes, getProjectTimeDisplay, getProjectTimeSumDisplay} from "../../../clocking.utils";
import {SelectButton} from "primeng/selectbutton";
import {DisplayOption} from "@craftingcrew/app/shared";
import {Tooltip} from "primeng/tooltip";
import {DailyRecordStatusComponent} from "./daily-record-status/daily-record-status.component";
import {DailyRecordActionComponent} from "./daily-record-action/daily-record-action.component";
import {ToggleButton} from "primeng/togglebutton";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {Select} from "primeng/select";

@Component({
  selector: 'app-clocking-approval',
  imports: [
    PrimeTemplate,
    TableModule,
    NgClass,
    ButtonDirective,
    Ripple,
    FormsModule,
    DatePicker,
    SelectButton,
    Tooltip,
    DailyRecordStatusComponent,
    DailyRecordActionComponent,
    ToggleButton,
    DropdownModule,
    Select
],
  standalone: true,
  templateUrl: './clocking-approval.component.html',
  styleUrl: './clocking-approval.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockingApprovalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tableContainer', {static: false}) tableContainer!: ElementRef;

  OPEN = ApprovalStatus.OPEN;
  APPROVED = ApprovalStatus.APPROVED;
  COMPLETED = ApprovalStatus.COMPLETED;

  protected readonly formatTimeInMinutes = formatTimeInMinutes;
  protected readonly getProjectTimeDisplay = getProjectTimeDisplay;
  protected readonly getProjectTimeSumDisplay = getProjectTimeSumDisplay;
  protected readonly keydownListener = (event: KeyboardEvent) => this.onKeydown(event);

  protected readonly scrollHeight$ = signal<string>('400px');
  protected readonly selectedMonth$ = signal<Date>(new Date());
  protected readonly showWeekends$ = signal<boolean>(false);
  protected readonly showProjects$ = computed(() => this.modeOption$()?.value === 'project-time')
  protected readonly mouseInside$ = signal<boolean>(false);
  protected readonly pickerMode$ = signal<DatePickerTypeView>('month');
  protected readonly visibleDays$ = computed(() => this.approvalDays$().filter(day => this.showWeekends$() || !day.weekend).length);
  protected readonly selectedTeam$ = model<Team>();

  /* state signals */
  protected readonly loading$: Signal<boolean>;
  protected readonly approvalDays$: Signal<Day[]>;
  protected readonly teams$: Signal<Team[]>;
  protected readonly visibleEmployeeApprovalStates$: Signal<EmployeeApprovalState[]>;

  protected modeOptions: DisplayOption[] = [
    {value: 'working-time', icon: 'timer', title: 'Working Time'},
    {value: 'project-time', icon: 'widgets', title: 'Project Time'},
  ];
  protected modeOption$ = signal(this.modeOptions[0]);

  constructor(private clockingService: ClockingApprovalService) {
    this.loading$ = this.clockingService.loading$;
    this.teams$ = this.clockingService.teams$;
    this.approvalDays$ = this.clockingService.approvalDays$;
    this.visibleEmployeeApprovalStates$ = this.clockingService.visibleEmployeeApprovalStates$;

    effect(() => {
      this.clockingService.dispatchLoadTeams();
      this.clockingService.dispatchLoadApprovals(startOfMonth(this.selectedMonth$()), endOfMonth(this.selectedMonth$()));
    });

  }

  ngAfterViewInit() {
    document.addEventListener('keydown', this.keydownListener);
    setTimeout(() => this.calculateTableHeight(), 0);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.keydownListener);
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateTableHeight();
  }

  private calculateTableHeight() {
    if (!this.tableContainer?.nativeElement) return;

    // Find the actual <table> inside the PrimeNG <p-table> container
    const tableElement = this.tableContainer.nativeElement.querySelector('table');
    if (!tableElement) return;

    const screenHeight = window.innerHeight; // Full viewport height
    const tableOffsetTop = tableElement.getBoundingClientRect().top; // Offset of actual <table>

    const availableHeight = screenHeight - tableOffsetTop - 20; // Remaining space for table
    this.scrollHeight$.set(`${availableHeight}px`); // Update signal dynamically
  }

  protected onKeydown(event: KeyboardEvent) {
    if (this.mouseInside$()) {
      if (event.shiftKey) {
        if (event.key === 'ArrowLeft') {
          this.onPrevMonth();
        } else if (event.key === 'ArrowRight') {
          this.onNextMonth();
        }
      }
    }
  }

  protected onPrevMonth() {
    this.setMonth(addDays(startOfMonth(this.selectedMonth$()), -1));
  }

  protected onNextMonth() {
    this.setMonth(addDays(endOfMonth(this.selectedMonth$()), 1));
  }

  protected setMonth(month: Date) {
    this.selectedMonth$.set(month);
  }

  protected formatEmployeeSummary(employeeState: EmployeeApprovalState) {
    return formatTimeInMinutes(employeeState.workedTimeMinutes) + ' / ' + formatTimeInMinutes(employeeState.normalTimeMinutes);
  }

  /**
   * Sets the mode option.
   *
   * @param {DisplayOption} option - The selected display option for the mode.
   */
  protected onSetModeOption(option: DisplayOption) {
    if (option) {
      this.modeOption$.set(option);
    } else {
      this.modeOption$.set({...this.modeOption$()});
    }
  }

  /**
   * Approves daily records for the specified employee within the selected month range.
   *
   * @param {MouseEvent} event - The mouse event that triggered the approval.
   * @param {EmployeeApprovalState} employeeState - The state of the employee whose records are being approved.
   */
  protected onApproveRecordsInRange(event: MouseEvent, employeeState: EmployeeApprovalState) {
    event.preventDefault();
    this.clockingService.approveDailyRecordsInRange(employeeState.employee, startOfMonth(this.selectedMonth$()), endOfMonth(this.selectedMonth$()));
  }

  /**
   * Handles the selection of a team from the dropdown.
   *
   * @param {DropdownChangeEvent} event - The event triggered by selecting a team from the dropdown.
   */
  protected onTeamSelected(event: DropdownChangeEvent) {
    this.clockingService.dispatchApplyTeamFilter(event.value);
  }
}
