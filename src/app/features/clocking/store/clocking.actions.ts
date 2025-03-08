import {createAction, props} from '@ngrx/store';
import {ApprovalState, DailyRecordState} from "./clocking.state";
import {Day, Employee, Team} from "../model/clocking.model";

export const clockingActionSuccess = createAction('[Clocking] Action Success');

export const loadInitialSuccess = createAction('[Clocking] Load of initial data success',
  props<{ from: Date, to: Date, approval: ApprovalState, teams: Team[] }>());

/**
 * Team actions
 */
export const loadTeams = createAction('[Clocking] Load teams');

export const loadTeamsSuccess = createAction('[Clocking] Load teams success',
  props<{ teams: Team[] }>());

/**
 * Filter actions
 */
export const applyTeamFilter = createAction('[Clocking] Apply team filter',
  props<{ team: Team }>());

/**
 * Approval actions
 */
export const loadApprovals = createAction('[Clocking] Load approval records in give date range',
  props<{ from: Date, to: Date }>());

export const loadApprovalsSuccess = createAction('[Clocking] Load approval records in give date range success',
  props<{ from: Date, to: Date, approval: ApprovalState }>());

/**
 * State change actions
 */
export const setNextDailyRecordState = createAction('[Clocking] Set next daily record state',
  props<{ employee: Employee, day: Day }>());

export const completeDailyRecord = createAction('[Clocking] Set daily record state to completed',
  props<{ employee: Employee, day: Day }>());

export const approveDailyRecord = createAction('[Clocking] Set daily record state to approved',
  props<{ employee: Employee, day: Day }>());

export const reopenDailyRecord = createAction('[Clocking] Set daily record state to open',
  props<{ employee: Employee, day: Day }>());

export const stateTransitionSuccess = createAction('[Clocking] Daily record state transition success',
  props<{ employee: Employee, dailyRecords: DailyRecordState[] }>());

export const approveDailyRecordsInRange = createAction('[Clocking] Set the states of daily records within the given date range states',
  props<{ employee: Employee, from: Date, to: Date }>());