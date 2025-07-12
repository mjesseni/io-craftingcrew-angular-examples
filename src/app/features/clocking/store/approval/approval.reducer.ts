import {createReducer, on} from '@ngrx/store';
import {ClockingApprovalState, initialClockingApprovalState} from "./approval.state";
import {
  applyTeamFilter,
  approveDailyRecord,
  approveDailyRecordsInRange,
  clockingApprovalActionSuccess,
  completeDailyRecord,
  loadApprovals,
  loadInitialSuccess,
  reopenDailyRecord,
  setNextDailyRecordState,
  stateTransitionSuccess
} from "./approval.actions";
import {getMinApprovalState} from "../../clocking.utils";

export const approvalReducer = createReducer(
  initialClockingApprovalState,
  on(clockingApprovalActionSuccess, (state) => ({...state, loading: false})),

  /**
   * Approval reducers
   */
  on(loadApprovals, (state) => (
    {...state, loading: true}
  )),
  on(loadInitialSuccess, (state, {approval, teams}) => (
    {...state, loading: false, approval: approval, teams: teams}
  )),
  on(setNextDailyRecordState, (state) => (
    {...state, loading: true}
  )),
  on(completeDailyRecord, (state) => (
    {...state, loading: true}
  )),
  on(approveDailyRecord, (state) => (
    {...state, loading: true}
  )),
  on(reopenDailyRecord, (state) => (
    {...state, loading: true}
  )),
  on(approveDailyRecordsInRange, (state) => (
    {...state, loading: true}
  )),
  on(applyTeamFilter, (state: ClockingApprovalState, {team}) => {
    if (state.approval != null) {
      let changed = false;
      const employeeStates = state.approval.employeeStates.map(employeeState => {
        const visible = team == null || employeeState.employee.team.id === team.id;
        if (employeeState.visible !== visible) {
          changed = true;
          return {...employeeState, visible: visible};
        }
        return employeeState;
      });
      return changed ? {...state, approval: {...state.approval, employeeStates}} : state;
    }
    return state;
  }),
  on(stateTransitionSuccess, (state: ClockingApprovalState, {employee, dailyRecords}) => {
    if (state.approval != null) {
      const employeeStates = state.approval.employeeStates.map(employeeState => {
        /* employee found */
        if (employeeState.employee.id === employee.id) {
          const newDailyRecords = employeeState.dailyRecords.map(record => {
            const dailyRecord = dailyRecords.find(changed => changed.day.date === record.day.date);
            return dailyRecord ? dailyRecord : record;
          });
          return {
            ...employeeState,
            approvalStatus: getMinApprovalState(newDailyRecords),
            dailyRecords: newDailyRecords
          };
        }
        /* other employee state */
        return employeeState;
      });
      return {...state, loading: false, approval: {...state.approval, employeeStates}};
    }
    return state;
  })
);