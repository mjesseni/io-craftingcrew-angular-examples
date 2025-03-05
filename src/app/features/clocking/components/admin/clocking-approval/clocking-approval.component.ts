import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  OnDestroy,
  Signal,
  signal,
  ViewChild
} from '@angular/core';
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {NgClass, NgIf} from "@angular/common";
import {addDays, endOfMonth, startOfMonth} from "date-fns";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {FormsModule} from "@angular/forms";
import {Checkbox} from "primeng/checkbox";
import {DatePicker, DatePickerTypeView} from "primeng/datepicker";
import {DailyRecordCellComponent} from "./daily-record-cell/daily-record-cell.component";
import {ApprovalStatus, Day} from "../../../model/clocking.model";
import {ClockingService} from "../../../services/clocking.service";
import {EmployeeApprovalState} from "../../../store/clocking.state";
import {formatTimeInMinutes} from "../../../clocking.utils";
import {SelectButton} from "primeng/selectbutton";
import {DisplayOption} from "@craftingcrew/app/shared";
import {Tooltip} from "primeng/tooltip";

@Component({
  selector: 'app-clocking-approval',
  imports: [
    PrimeTemplate,
    TableModule,
    NgIf,
    NgClass,
    ButtonDirective,
    Ripple,
    FormsModule,
    Checkbox,
    DatePicker,
    DailyRecordCellComponent,
    SelectButton,
    Tooltip
  ],
  templateUrl: './clocking-approval.component.html',
  styleUrl: './clocking-approval.component.scss'
})
export class ClockingApprovalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tableContainer', {static: false}) tableContainer!: ElementRef;


  protected readonly ApprovalStatus = ApprovalStatus;
  protected readonly keydownListener = (event: KeyboardEvent) => this.onKeydown(event);

  protected readonly scrollHeight$ = signal<string>('400px');
  protected readonly selectedMonth$ = signal<Date>(new Date());
  protected readonly showWeekends$ = signal<boolean>(false);
  protected readonly mouseInside$ = signal<boolean>(false);
  protected readonly pickerMode$ = signal<DatePickerTypeView>('month');

  /* state signals */
  protected readonly loading$: Signal<boolean>;
  protected readonly approvalDays$: Signal<Day[]>;
  protected readonly employeeApprovalStates$: Signal<EmployeeApprovalState[]>;

  protected modeOptions: DisplayOption[] = [
    {value: 'working-time', icon: 'timer', title: 'Working Time'},
    {value: 'project-time', icon: 'widgets', title: 'Project Time'},
  ];
  protected modeOption$ = signal(this.modeOptions[0]);

  protected timeRangeOptions: DisplayOption[] = [
    {value: 'day-range', icon: 'calendar_view_day', title: 'Day'},
    {value: 'week-range', icon: 'calendar_view_week', title: 'Week'},
    {value: 'month-range', icon: 'calendar_view_month', title: 'Month'},
  ];
  protected timeRangeOption$ = signal(this.timeRangeOptions[0]);

  constructor(private clockingService: ClockingService) {
    this.loading$ = this.clockingService.loading$;
    this.approvalDays$ = this.clockingService.approvalDays$;
    this.employeeApprovalStates$ = this.clockingService.employeeApprovalStates$;

    effect(() => {
      this.clockingService.dispatchLoadApprovals(startOfMonth(this.selectedMonth$()), endOfMonth(this.selectedMonth$()))
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
    const tableOffsetTop = tableElement.getBoundingClientRect().top + 52; // Offset of actual <table>

    const availableHeight = screenHeight - tableOffsetTop; // Remaining space for table
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
   * Sets the time range option.
   *
   * @param {DisplayOption} option - The selected display option for the time range.
   */
  protected onSetTimeRangeOption(option: DisplayOption) {
    if (option) {
      this.timeRangeOption$.set(option);
    } else {
      this.timeRangeOption$.set({...this.timeRangeOption$()});
    }
  }

  protected onApprove(event: MouseEvent, employeeState: any) {
    event.preventDefault();
  }
}
