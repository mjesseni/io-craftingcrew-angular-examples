import {Component, effect, signal, ViewEncapsulation} from '@angular/core';
import {ApprovalStatus, Day} from "../../../model/clocking.model";
import {DatePipe, NgIf} from "@angular/common";
import {Card} from "primeng/card";
import {TableModule} from "primeng/table";
import {DailyRecordState} from "../../../store/clocking.state";
import {
  DailyRecordStatusComponent
} from "../../admin/clocking-approval/daily-record-status/daily-record-status.component";
import {NgxEchartsDirective} from "ngx-echarts";
import {InputText} from "primeng/inputtext";
import {Textarea} from "primeng/textarea";
import {formatTimeInMinutes, getWorkEntryKinds} from "../../../clocking.utils";
import {Select} from "primeng/select";
import {InputMask} from "primeng/inputmask";
import {ButtonDirective} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {DatePicker, DatePickerTypeView} from "primeng/datepicker";
import {ToggleButton} from "primeng/togglebutton";
import {Tooltip} from "primeng/tooltip";
import {addDays, endOfMonth, startOfMonth} from "date-fns";
import {FormsModule} from "@angular/forms";
import {
  DailyRecordActionComponent
} from "../../admin/clocking-approval/daily-record-action/daily-record-action.component";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {provideNgxMask} from "ngx-mask";

@Component({
  selector: 'app-time-tracking',
  templateUrl: './time-tracking.component.html',
  imports: [
    DatePipe,
    Card,
    TableModule,
    DailyRecordStatusComponent,
    NgxEchartsDirective,
    InputText,
    Textarea,
    Select,
    InputMask,
    ButtonDirective,
    Ripple,
    DatePicker,
    NgIf,
    ToggleButton,
    Tooltip,
    FormsModule,
    DailyRecordActionComponent
  ],
  providers: [provideNgxMask()],
  styleUrl: './time-tracking.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class TimeTrackingComponent {
  days$ = signal<Day[]>([
    {date: new Date('2025-03-01'), weekend: false, dayOfMonth: 1, shortDayOfWeek: 'Mo'},
    {date: new Date('2025-03-02'), weekend: false, dayOfMonth: 2, shortDayOfWeek: 'DI'},
    {date: new Date('2025-03-03'), weekend: false, dayOfMonth: 3, shortDayOfWeek: 'Mi'},
    {date: new Date('2025-03-04'), weekend: false, dayOfMonth: 4, shortDayOfWeek: 'Do'},
    {date: new Date('2025-03-05'), weekend: false, dayOfMonth: 5, shortDayOfWeek: 'Fr'},
    {date: new Date('2025-03-06'), weekend: true, dayOfMonth: 6, shortDayOfWeek: 'Sa'},
    {date: new Date('2025-03-07'), weekend: true, dayOfMonth: 7, shortDayOfWeek: 'So'},
  ])
  protected readonly dailyRecords = signal<[{ records: DailyRecordState[] }]>([{
    records: []
  }]);
  protected readonly pickerMode$ = signal<DatePickerTypeView>('month');
  protected readonly selectedMonth$ = signal<Date>(new Date());
  protected readonly workEntryKinds$ = signal<string[]>(getWorkEntryKinds());
  protected readonly currentDate$ = signal<Date>(new Date());
  protected readonly selectedDay$ = signal<Day | null>(null);
  protected readonly showWeekends$ = signal<boolean>(false);
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

  chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} hours ({d}%)'
    },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'], // Inner and outer radius (Doughnut effect)
        startAngle: 180, // Start at bottom (optional)
        label: {
          show: true,
          position: 'inside',
          fontSize: 14,
          color: '#fff',
          formatter: '{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          {value: 35, name: 'Worked Hours', itemStyle: {color: '#2E86C1'}}, // Blue
          {value: 25, name: 'Remaining Expected Hours', itemStyle: {color: '#E74C3C'}}, // Red
          {value: 40, name: '', itemStyle: {color: 'transparent'}} // Hide the bottom half
        ]
      }
    ]
  };

  selectedTime: string | null = null;
  timeOptions: string[] = this.generateTimeOptions();
  filteredTimes: string[] = [];

  constructor() {
    effect(() => {
      if (this.days$()) {
        this.selectedDay$.set(this.days$()[0]);
      }
    });
  }

  protected onDaySelected(day: Day) {
    this.selectedDay$.set(day);
  }

  protected onKeyDown(evt: KeyboardEvent, day: Day) {
    this.selectedDay$.set(day);
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

  generateTimeOptions(): string[] {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 10) {
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return times;
  }

  filterTimes(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    this.filteredTimes = this.timeOptions.filter(time => time.startsWith(query));
  }

  onValueChange() {
    console.log(this.selectedTime);
  }

  validateManualTime() {
    const regex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
    console.log(this.selectedTime);
    if (!this.selectedTime || !regex.test(this.selectedTime)) {
      this.selectedTime = null;
    }
  }

  protected readonly formatTimeInMinutes = formatTimeInMinutes;
}
