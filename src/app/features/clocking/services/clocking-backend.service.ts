import {Injectable} from '@angular/core';
import {ApprovalState, DailyRecordState, Employee, EmployeeApprovalState} from "../store/clocking.state";
import {ApprovalStatus, Day, WorkingStatus} from "../model/clocking.model";
import {EMPTY, Observable, of, take} from "rxjs";
import {getMinApprovalState} from "../clocking.utils";
import {addDays, endOfMonth, format, getDate, isAfter, isBefore, isSameDay, isWeekend, startOfMonth} from "date-fns";
import {delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClockingBackendService {

  employeeStates: EmployeeApprovalState[] = [];

  /**
   * Sets the next daily record state for a given employee and day.
   *
   * This method updates the approval status of the daily record for the specified employee and day.
   * The approval status cycles through OPEN, COMPLETED, and APPROVED.
   *
   * @param employee - The employee for whom to set the next daily record state.
   * @param day - The day for which to set the next daily record state.
   * @returns An Observable of the updated DailyRecordState.
   */
  public setNextDailyRecordState(employee: Employee, day: Day): Observable<DailyRecordState[]> {
    const current = this.findEmployeeDailyRecordState(employee, day);
    if (current) {
      const newApprovalStatus = this.getNextApprovalState(current.approvalStatus);
      return this.setDailyRecordApprovalState(employee, day.date, day.date, newApprovalStatus);
    }
    return EMPTY;
  }


  /**
   * Sets the approval status for daily records of an employee within a date range.
   *
   * @param employee - The employee whose daily records are to be updated.
   * @param from - The start date of the range.
   * @param to - The end date of the range.
   * @param newApprovalStatus - The new approval status to be set.
   * @returns An Observable of the updated DailyRecordState array.
   */
  public setDailyRecordApprovalState(employee: Employee, from: Date, to: Date, newApprovalStatus: ApprovalStatus): Observable<DailyRecordState[]> {
    const changed: DailyRecordState[] = [];
    this.employeeStates = this.employeeStates.map(employeeState => {
      if (employeeState.employee.id === employee.id) {
        const dailyRecords = employeeState.dailyRecords.map(record => {
          if (this.canChangeApprovalState(record, from, to, newApprovalStatus)) {
            const changedRecord = {...record, approvalStatus: newApprovalStatus}
            changed.push(changedRecord);
            return changedRecord;
          }
          return record;
        });
        return {
          ...employeeState,
          approvalStatus: getMinApprovalState(dailyRecords),
          dailyRecords: dailyRecords
        };
      }
      return employeeState;
    });

    return of(changed).pipe(delay(150), take(1));
  }

  public loadEmployeeApprovals(from: Date, to: Date): Observable<ApprovalState> {
    const start = startOfMonth(from);
    const end = endOfMonth(to);
    const days = this.getDays(start, end);
    this.employeeStates = [
      this.createEmployeeApprovalRecord('1', 'Christian Employee', days),
      this.createEmployeeApprovalRecord('2', 'Cathrine Employee', days),
      this.createEmployeeApprovalRecord('3', 'Franziska Employee', days),
      this.createEmployeeApprovalRecord('4', 'Joseph Employee', days),
      this.createEmployeeApprovalRecord('5', 'Max Employee', days),
      this.createEmployeeApprovalRecord('6', 'Markus Employee', days),
      this.createEmployeeApprovalRecord('7', 'Frank Employee', days),
      this.createEmployeeApprovalRecord('8', 'Kenny Employee', days),
      this.createEmployeeApprovalRecord('9', 'Franz Employee', days),
      this.createEmployeeApprovalRecord('10', 'Bert Employee', days),
      this.createEmployeeApprovalRecord('11', 'Clarisa Employee', days),
      this.createEmployeeApprovalRecord('12', 'Rob Employee', days),
      this.createEmployeeApprovalRecord('13', 'Sue Employee', days),
    ].sort((a, b) => a.employee.name.localeCompare(b.employee.name));

    return of({
      from: start,
      to: end,
      days: days,
      employeeStates: this.employeeStates
    }).pipe(delay(150), take(1));
  }

  private canChangeApprovalState(record: DailyRecordState, from: Date, to: Date, newApprovalStatus: ApprovalStatus): boolean {
    const affected = this.isInRange(record.date, from, to) && record.approvalStatus !== newApprovalStatus;
    if (affected) {
      switch (newApprovalStatus) {
        case ApprovalStatus.OPEN:
          return record.approvalStatus === ApprovalStatus.COMPLETED || record.approvalStatus === ApprovalStatus.APPROVED;
        case ApprovalStatus.COMPLETED:
          return record.approvalStatus === ApprovalStatus.OPEN;
        case ApprovalStatus.APPROVED: {
          if (record.day.weekend || record.workingStatus !== WorkingStatus.WORKING) {
            return true;
          }
          return record.approvalStatus === ApprovalStatus.COMPLETED;
        }
      }
    }
    return false;
  }

  private isInRange(date: Date, from: Date, to: Date) {
    return (isSameDay(from, date) || isAfter(date, from)) && (isSameDay(date, to) || isBefore(date, to))
  }

  private findEmployeeDailyRecordState(employee: Employee, day: Day) {
    return this.employeeStates.find(state => state.employee.id === employee.id)?.dailyRecords
      .find(record => isSameDay(record.day.date, day.date));
  }

  private getNextApprovalState(state: ApprovalStatus | undefined) {
    switch (state) {
      case ApprovalStatus.OPEN:
        return ApprovalStatus.COMPLETED;
      case ApprovalStatus.COMPLETED:
        return ApprovalStatus.APPROVED;
      case ApprovalStatus.APPROVED:
        return ApprovalStatus.OPEN;
      default:
        return ApprovalStatus.OPEN;
    }
  }

  private createEmployeeApprovalRecord(employeeId: string, employeeName: string, days: Day[]): EmployeeApprovalState {
    const employee: Employee = {id: employeeId, name: employeeName, initials: this.getInitials(employeeName)};
    const dailyRecords = this.getDailyRecords(days);

    return {
      employee: employee,
      dailyRecords: dailyRecords,

      approvalStatus: getMinApprovalState(dailyRecords),

      normalTimeMinutes: dailyRecords.reduce((sum, record) => sum + (record?.normalTimeMinutes || 0), 0),
      workedTimeMinutes: dailyRecords.reduce((sum, record) => sum + (record?.workedTimeMinutes || 0), 0),
      bookedTimeMinutes: dailyRecords.reduce((sum, record) => sum + (record?.bookedTimeMinutes || 0), 0),

    } as EmployeeApprovalState;
  }

  private getDailyRecords(days: Day[]): DailyRecordState[] {
    return days.map(day => {
      if (!day.weekend) {
        const normalTimeMinutes = 7.7 * 60;
        const workedTimeMinutes = Math.floor(Math.random() * 60 * 10);
        const bookedTimeMinutes = Math.random() > 0.5 ? workedTimeMinutes : Math.floor(Math.random() * workedTimeMinutes);
        return {
          date: day.date,
          day: day,

          approvalStatus: this.getRandomApprovalStatus(),
          workingStatus: this.getRandomWorkingStatus(),

          normalTimeMinutes: normalTimeMinutes,
          workedTimeMinutes: workedTimeMinutes,
          bookedTimeMinutes: bookedTimeMinutes
        } as DailyRecordState;
      }

      return {
        date: day.date,
        day: day
      } as DailyRecordState;
    });
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  private getDays(start: Date, end: Date): Day[] {
    const result: Day[] = [];
    let currentDay = start;
    while (currentDay <= end) {
      result.push({
        date: currentDay,
        dayOfMonth: getDate(currentDay),
        shortDayOfWeek: format(currentDay, 'E'),
        weekend: isWeekend(currentDay)
      });
      currentDay = addDays(currentDay, 1);
    }
    return result;
  }

  private getRandomApprovalStatus(): ApprovalStatus {
    const statuses = Object.values(ApprovalStatus).filter(value => typeof value === 'number') as ApprovalStatus[];
    return statuses[Math.floor(Math.random() * statuses.length)] || ApprovalStatus.OPEN;
  }

  private getRandomWorkingStatus(): WorkingStatus {
    const statuses = Object.values(WorkingStatus).filter(value => typeof value === 'number') as WorkingStatus[];
    return statuses[Math.floor(Math.random() * statuses.length)] || WorkingStatus.WORKING;
  }
}
