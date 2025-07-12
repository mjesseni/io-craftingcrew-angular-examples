import {ApprovalStatus, Day, Employee, Project, Team, WorkingStatus} from "../../model/clocking.model";

/**
 * Represents the state of a project record.
 */
export interface ProjectRecordState {
  /** The project associated with the record. */
  project: Project;

  /** The time spent on the project in minutes. */
  timeInMinutes: number;

  /** Optional comment associated with the project record. */
  comment?: string;
}

/**
 * Represents the state of a daily record for an employee.
 */
export interface DailyRecordState {
  /** The date of the record. */
  date: Date;

  /** The day details of the record. */
  day: Day;

  /** The approval status of the record. */
  approvalStatus?: ApprovalStatus;

  /** The working status of the record. */
  workingStatus?: WorkingStatus;

  /** The normal time in minutes for the record. */
  normalTimeMinutes?: number;

  /** The worked time in minutes for the record. */
  workedTimeMinutes?: number;

  /** The booked time in minutes for the record. */
  bookedTimeMinutes?: number;

  /** The absence time in minutes for the record. */
  absenceTimeMinutes?: number;

  /** The vacation time in minutes for the record. */
  vacationTimeMinutes?: number;

  /** The array of project records associated with the daily record. */
  projectRecords?: ProjectRecordState[];
}

/**
 * Represents the approval state of an employee.
 */
export interface EmployeeApprovalState {
  /** The employee details. */
  employee: Employee;

  /** The list of projects associated with the employee. */
  projects: Project[];

  /** The array of daily records for the employee. */
  dailyRecords: DailyRecordState[];

  /** The overall approval status of the employee. */
  approvalStatus: ApprovalStatus;

  /** The total normal time in minutes for the employee. */
  normalTimeMinutes: number;

  /** The total worked time in minutes for the employee. */
  workedTimeMinutes: number;

  /** The total booked time in minutes for the employee. */
  bookedTimeMinutes: number;

  /** The total absence time in minutes for the employee. */
  absenceTimeMinutes: number;

  /** The total vacation time in minutes for the employee. */
  vacationTimeMinutes: number;

  /** Indicates whether the employee's approval state is visible. */
  visible: boolean;
}

/**
 * Represents the approval state within a specific date range.
 */
export interface ApprovalState {

  /** The start date of the approval period. */
  from: Date;

  /** The end date of the approval period. */
  to: Date;

  /** The array of days within the approval period. */
  days: Day[];

  /** The array of employee approval states within the approval period. */
  employeeStates: EmployeeApprovalState[];
}

export interface ClockingApprovalState {
  loading: boolean;
  error: never | undefined;

  teams: Team[];
  approval: ApprovalState | undefined
}

export const initialClockingApprovalState: ClockingApprovalState = {
  loading: false,
  error: undefined,

  /* the teams */
  teams: [],

  /* sub feature state*/
  approval: undefined
};