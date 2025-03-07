import {computed, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ApprovalState, ClockingState, DailyRecordState, EmployeeApprovalState} from "../store/clocking.state";
import {ApprovalStatus, Day, Employee} from "../model/clocking.model";
import {Store} from "@ngrx/store";
import {
  approveDailyRecord,
  approveDailyRecordsInRange,
  completeDailyRecord,
  loadApprovals,
  reopenDailyRecord,
  setNextDailyRecordState
} from "../store/clocking.actions";
import {selectApprovalState, selectLoadingState} from "../store/clocking.selectors";
import {ClockingBackendService} from "./clocking-backend.service";

/**
 * Service for managing clocking actions and state.
 *
 * This service provides methods to dispatch actions related to clocking, such as loading approvals, setting daily
 * record states, and updating approval statuses. It interacts with the store and backend service to perform these
 * operations.
 */
@Injectable({providedIn: 'root'})
export class ClockingService {

  loading$ = this.clockingStore.selectSignal(selectLoadingState);
  approval$ = this.clockingStore.selectSignal(selectApprovalState);
  approvalDays$ = computed(() => this.approval$()?.days || []);
  employeeApprovalStates$ = computed(() => this.approval$()?.employeeStates || []);

  employeeStates: EmployeeApprovalState[] = [];

  constructor(private readonly clockingStore: Store<ClockingState>,
              private readonly clockingBackendService: ClockingBackendService) {
  }

  /**
   * Dispatches an action to load approval data for a given date range.
   *
   * This method triggers the `loadApprovals` action with the specified date range, which will initiate the process of
   * fetching approval data from the store.
   *
   * @param from - The start date of the range for which to load approvals.
   * @param to - The end date of the range for which to load approvals.
   */
  public dispatchLoadApprovals(from: Date, to: Date): void {
    this.clockingStore.dispatch(loadApprovals({from, to}));
  }

  /**
   * Dispatches an action to set the next daily record state for a given employee and day.
   *
   * This method triggers the `setNextDailyRecordState` action with the specified employee and day,
   * which will update the daily record state in the store.
   *
   * @param employee - The employee for whom to set the next daily record state.
   * @param day - The day for which to set the next daily record state.
   */
  public setDailyRecordState(employee: Employee | undefined, day: Day | undefined): void {
    if (employee && day) {
      this.clockingStore.dispatch(setNextDailyRecordState({employee, day}));
    }
  }

  /**
   * Dispatches an action to complete the daily record for a given employee and day.
   *
   * @param employee - The employee for whom to complete the daily record.
   * @param day - The day for which to complete the daily record.
   */
  public completeDailyRecord(employee: Employee | undefined, day: Day | undefined): void {
    if (employee && day) {
      this.clockingStore.dispatch(completeDailyRecord({employee, day}));
    }
  }

  /**
   * Dispatches an action to approve the daily record for a given employee and day.
   *
   * @param employee - The employee for whom to approve the daily record.
   * @param day - The day for which to approve the daily record.
   */
  public approveDailyRecord(employee: Employee | undefined, day: Day | undefined): void {
    if (employee && day) {
      this.clockingStore.dispatch(approveDailyRecord({employee, day}));
    }
  }

  /**
   * Dispatches an action to reopen the daily record for a given employee and day.
   *
   * @param employee - The employee for whom to reopen the daily record.
   * @param day - The day for which to reopen the daily record.
   */
  public reopenDailyRecord(employee: Employee | undefined, day: Day | undefined): void {
    if (employee && day) {
      this.clockingStore.dispatch(reopenDailyRecord({employee, day}));
    }
  }

  /**
   * Dispatches an action to approve daily records for a given employee within a specified date range.
   *
   * @param employee - The employee for whom to approve daily records.
   * @param from - The start date of the range for which to approve daily records.
   * @param to - The end date of the range for which to approve daily records.
   */
  public approveDailyRecordsInRange(employee: Employee | undefined, from: Date | undefined, to: Date | undefined): void {
    if (employee && from && to) {
      this.clockingStore.dispatch(approveDailyRecordsInRange({employee, from, to}));
    }
  }

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
    return this.clockingBackendService.setNextDailyRecordState(employee, day);
  }


  /**
   * Sets the approval state for daily records of a given employee within a specified date range.
   *
   * This method updates the approval status of the daily records for the specified employee and date range.
   *
   * @param employee - The employee for whom to set the daily record approval state.
   * @param from - The start date of the range for which to set the approval state.
   * @param to - The end date of the range for which to set the approval state.
   * @param newApprovalStatus - The new approval status to set for the daily records.
   * @returns An Observable of the updated ApprovalState.
   */
  public setDailyRecordApprovalState(employee: Employee, from: Date, to: Date, newApprovalStatus: ApprovalStatus) {
    return this.clockingBackendService.setDailyRecordApprovalState(employee, from, to, newApprovalStatus);
  }

  /**
   * Loads employee approvals for a given date range.
   *
   * This method fetches the approval state for employees within the specified date range
   * from the backend service.
   *
   * @param from - The start date of the range for which to load approvals.
   * @param to - The end date of the range for which to load approvals.
   * @returns An Observable of the ApprovalState.
   */
  public loadEmployeeApprovals(from: Date, to: Date): Observable<ApprovalState> {
    return this.clockingBackendService.loadEmployeeApprovals(from, to);
  }
}