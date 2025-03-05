import {ApprovalStatus, Day, WorkingStatus} from "../model/clocking.model";

export interface DailyRecordState {
  date: Date;
  day: Day

  approvalStatus?: ApprovalStatus;
  workingStatus?: WorkingStatus;

  normalTimeMinutes?: number;
  workedTimeMinutes?: number;
  bookedTimeMinutes?: number;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
}

export interface EmployeeApprovalState {
  employee: Employee;
  dailyRecords: DailyRecordState[];

  approvalStatus: ApprovalStatus;

  normalTimeMinutes: number;
  workedTimeMinutes: number;
  bookedTimeMinutes: number;
}

export interface ApprovalState {
  from: Date;
  to: Date;
  days: Day[];
  employeeStates: EmployeeApprovalState[];
}

export interface ClockingState {
  loading: boolean;
  error: never | undefined;

  approval: ApprovalState | undefined
}

export const initialClockingState: ClockingState = {
  loading: false,
  error: undefined,

  /* sub feature state*/
  approval: undefined
};