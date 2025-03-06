import {createReducer, on} from '@ngrx/store';
import {initialClockingState} from "./clocking.state";
import {
  approveDailyRecord, approveDailyRecordsInRange,
  clockingActionSuccess,
  completeDailyRecord,
  loadApprovals,
  loadApprovalsSuccess,
  reopenDailyRecord,
  setNextDailyRecordState,
  stateTransitionSuccess
} from "./clocking.actions";
import {getMinApprovalState} from "../clocking.utils";

export const clockingReducer = createReducer(
  initialClockingState,
  on(clockingActionSuccess, (state) => ({...state, loading: false})),

  /**
   * Approval reducers
   */
  on(loadApprovals, (state) => (
    {...state, loading: true}
  )),
  on(loadApprovalsSuccess, (state, {approval}) => (
    {...state, loading: false, approval: approval}
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
  on(stateTransitionSuccess, (state, {employee, dailyRecords}) => {
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