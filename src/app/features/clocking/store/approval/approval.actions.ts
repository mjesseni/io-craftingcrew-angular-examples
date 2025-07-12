import {createAction, props} from '@ngrx/store';
import {ApprovalState, DailyRecordState} from "./approval.state";
import {Day, Employee, Team} from "../../model/clocking.model";

const prefix = '[Clocking] [Approval]';

export const clockingApprovalActionSuccess =
  createAction(`${prefix} Action Success`);

export const loadInitialSuccess =
  createAction(`${prefix} Load of initial data success`,
    props<{ from: Date, to: Date, approval: ApprovalState, teams: Team[] }>());

/**
 * Team actions
 */
export const loadTeams =
  createAction(`${prefix} Load teams`);

export const loadTeamsSuccess =
  createAction(`${prefix} Load teams success`,
    props<{ teams: Team[] }>());

/**
 * Filter actions
 */
export const applyTeamFilter =
  createAction(`${prefix} Apply team filter`,
    props<{ team: Team }>());

/**
 * Approval actions
 */
export const loadApprovals =
  createAction(`${prefix} Load approval records in give date range`,
    props<{ from: Date, to: Date }>());

export const loadApprovalsSuccess =
  createAction(`${prefix} Load approval records in give date range success`,
    props<{ from: Date, to: Date, approval: ApprovalState }>());

/**
 * State change actions
 */
export const setNextDailyRecordState =
  createAction(`${prefix} Set next daily record state`,
    props<{ employee: Employee, day: Day }>());

export const completeDailyRecord =
  createAction(`${prefix} Set daily record state to completed`,
    props<{ employee: Employee, day: Day }>());

export const approveDailyRecord =
  createAction(`${prefix} Set daily record state to approved`,
    props<{ employee: Employee, day: Day }>());

export const reopenDailyRecord =
  createAction(`${prefix} Set daily record state to open`,
    props<{ employee: Employee, day: Day }>());

export const stateTransitionSuccess =
  createAction(`${prefix} Daily record state transition success`,
    props<{ employee: Employee, dailyRecords: DailyRecordState[] }>());

export const approveDailyRecordsInRange =
  createAction(`${prefix} Set the states of daily records within the given date range states`,
    props<{ employee: Employee, from: Date, to: Date }>());