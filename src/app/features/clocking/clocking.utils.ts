import {DailyRecordState, EmployeeApprovalState} from "./store/clocking.state";
import {Project, WorkEntryKind} from "./model/clocking.model";

/**
 * Formats a given time in minutes to a string in the format `HH:mm`.
 *
 * @param {number} timeInMinutes - The time in minutes to format.
 * @returns {string} The formatted time string in `HH:mm` format.
 *
 * @example
 * // Returns '02:30'
 * formatTimeInMinutes(150);
 *
 * @example
 * // Returns '00:45'
 * formatTimeInMinutes(45);
 */
export const formatTimeInMinutes = (timeInMinutes: number): string => {
  if (timeInMinutes) {
    const absMinutes = Math.abs(timeInMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return (timeInMinutes < 0 ? '-' : '') + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  }
  return '';
}


/**
 * Gets the minimum approval state from an array of daily records.
 *
 * @param {DailyRecordState[]} dailyRecords - The array of daily records.
 * @returns {number} The minimum approval state, or Infinity if no approval state is found.
 */
export const getMinApprovalState = (dailyRecords: DailyRecordState[]): number => {
  return dailyRecords.map(record => record.approvalStatus ?? Infinity)
    .reduce((min, status) => Math.min(min, status), Infinity);
}


export const getProjectTimeDisplay = (state: DailyRecordState | undefined, project: Project) => {
  const projectRecord = state?.projectRecords?.find(record => record.project.id === project.id);
  return projectRecord && projectRecord.timeInMinutes > 0 ? formatTimeInMinutes(projectRecord.timeInMinutes) : '';
}

export const getProjectTimeSumDisplay = (state: EmployeeApprovalState | undefined, project: Project) => {
  const projectTime = state?.dailyRecords
    .map(record => record.projectRecords?.find(projectRecord => projectRecord.project.id === project.id))
    .filter(record => !!record)
    .reduce((sum, record) => sum + record!.timeInMinutes, 0) || 0;

  return projectTime > 0 ? formatTimeInMinutes(projectTime) : '';
}

/**
 * Retrieves all work entry kinds as an array of strings.
 *
 * @returns {string[]} An array of work entry kinds.
 */
export const getWorkEntryKinds = (): string[] => {
  return Object.values(WorkEntryKind).filter(value => typeof value === "string");
}