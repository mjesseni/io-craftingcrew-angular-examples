import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from "@ngrx/store";
import {ClockingService} from "../services/clocking.service";
import {
  approveDailyRecord,
  approveDailyRecordsInRange,
  completeDailyRecord,
  loadApprovals,
  loadApprovalsSuccess,
  reopenDailyRecord,
  setNextDailyRecordState,
  stateTransitionSuccess
} from "./clocking.actions";
import {mergeMap, of} from "rxjs";
import {ApprovalStatus} from "../model/clocking.model";
import {Employee} from "./clocking.state";

@Injectable()
export class ClockingEffects {
  constructor(private actions$: Actions, private clockingService: ClockingService, private store: Store) {
  }

  loadApprovals$ = createEffect(() => this.actions$.pipe(
    ofType(loadApprovals),
    mergeMap((action) => {
      return this.clockingService.loadEmployeeApprovals(action.from, action.to).pipe(
        mergeMap((approvalState) => {
          return of(loadApprovalsSuccess({
            from: action.from,
            to: action.to,
            approval: approvalState
          }));
        }))
    })
  ));

  setNextDailyRecordState$ = createEffect(() => this.actions$.pipe(
    ofType(setNextDailyRecordState, completeDailyRecord, approveDailyRecord, reopenDailyRecord),
    mergeMap((action) => {
      return this.clockingService.setNextDailyRecordState(action.employee, action.day).pipe(
        mergeMap((changedRecords) => {
          return of(stateTransitionSuccess({
            employee: action.employee,
            dailyRecords: changedRecords
          }));
        }))
    })
  ));

  completeDailyRecord$ = createEffect(() => this.actions$.pipe(
    ofType(completeDailyRecord),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.day.date, action.day.date, ApprovalStatus.COMPLETED);
    })
  ));

  approveDailyRecord$ = createEffect(() => this.actions$.pipe(
    ofType(approveDailyRecord),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.day.date, action.day.date, ApprovalStatus.APPROVED);
    })
  ));


  reopenDailyRecord$ = createEffect(() => this.actions$.pipe(
    ofType(reopenDailyRecord),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.day.date, action.day.date, ApprovalStatus.OPEN);
    })
  ));

  approveDailyRecordsInRange$ = createEffect(() => this.actions$.pipe(
    ofType(approveDailyRecordsInRange),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.from, action.to, ApprovalStatus.APPROVED);
    })
  ));

  private setDailyRecordApprovalStatus(employee: Employee, from: Date, to: Date, status: ApprovalStatus) {
    return this.clockingService.setDailyRecordApprovalState(employee, from, to, status).pipe(
      mergeMap((changedRecords) => {
        return of(stateTransitionSuccess({
          employee: employee,
          dailyRecords: changedRecords
        }));
      }))
  };
}