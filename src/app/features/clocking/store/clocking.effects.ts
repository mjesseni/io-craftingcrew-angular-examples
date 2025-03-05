import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from "@ngrx/store";
import {ClockingService} from "../services/clocking.service";
import {
  approveDailyRecord,
  completeDailyRecord,
  dailyRecordStateTransitionSuccess,
  loadApprovals,
  loadApprovalsSuccess,
  reopenDailyRecord,
  setNextDailyRecordState
} from "./clocking.actions";
import {mergeMap, of} from "rxjs";
import {ApprovalStatus, Day} from "../model/clocking.model";
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
        mergeMap((dailyRecord) => {
          return of(dailyRecordStateTransitionSuccess({
            employee: action.employee,
            dailyRecord: dailyRecord
          }));
        }))
    })
  ));

  completeDailyRecord$ = createEffect(() => this.actions$.pipe(
    ofType(completeDailyRecord),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.day, ApprovalStatus.COMPLETED);
    })
  ));

  approveDailyRecord$ = createEffect(() => this.actions$.pipe(
    ofType(approveDailyRecord),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.day, ApprovalStatus.APPROVED);
    })
  ));


  reopenDailyRecord$ = createEffect(() => this.actions$.pipe(
    ofType(reopenDailyRecord),
    mergeMap((action) => {
      return this.setDailyRecordApprovalStatus(action.employee, action.day, ApprovalStatus.OPEN);
    })
  ));

  private setDailyRecordApprovalStatus(employee: Employee, day: Day, status: ApprovalStatus) {
    return this.clockingService.setDailyRecordApprovalState(employee, day, status).pipe(
      mergeMap((dailyRecord) => {
        return of(dailyRecordStateTransitionSuccess({
          employee: employee,
          dailyRecord: dailyRecord
        }));
      }))
  };
}