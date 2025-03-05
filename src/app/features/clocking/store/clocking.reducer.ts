import {createReducer, on} from '@ngrx/store';
import {initialClockingState} from "./clocking.state";
import {
  clockingActionSuccess,
  loadApprovals,
  loadApprovalsSuccess,
  setNextDailyRecordState,
  dailyRecordStateTransitionSuccess, completeDailyRecord, approveDailyRecord, reopenDailyRecord
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
  on(dailyRecordStateTransitionSuccess, (state, {employee, dailyRecord}) => {
    if (state.approval != null) {
      const employeeStates = state.approval.employeeStates.map(employeeState => {
        /* employee found */
        if (employeeState.employee.id === employee.id) {
          const dailyRecords = employeeState.dailyRecords.map(record => {
            if (record.day.date === dailyRecord.day.date) {
              return dailyRecord;
            }
            return record;
          });
          return {...employeeState,
            approvalStatus: getMinApprovalState(dailyRecords),
            dailyRecords: dailyRecords
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