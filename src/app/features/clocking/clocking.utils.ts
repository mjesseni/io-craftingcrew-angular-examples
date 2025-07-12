import {DailyRecordState, EmployeeApprovalState} from "./store/approval/approval.state";
import {Day, Project, WorkEntryKind} from "./model/clocking.model";
import {format, getDate, isWeekend} from "date-fns";

/**
 * Converts a given date to a Day object.
 *
 * @param {Date} date - The date to convert.
 * @returns {Day} The Day object containing date, day of the month, short day of the week, and weekend status.
 */
export const dateToDay = (date: Date): Day => {
  return {
    date: date,
    dayOfMonth: getDate(date),
    shortDayOfWeek: format(date, 'E').slice(0, 2),
    weekend: isWeekend(date)
  };
}

export const getMonth = (date: Date): Day[] => {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({length: daysInMonth}, (_, index) => {
    const day = new Date(date.getFullYear(), date.getMonth(), index + 1);
    return dateToDay(day);
  });
}

export const getWeek = (date: Date): Day[] => {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);
  return Array.from({length: 7}, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return dateToDay(day);
  });
}

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


/**
 * Gets the formatted time display for a specific project from the daily record state.
 *
 * @param {DailyRecordState | undefined} state - The state containing the daily records.
 * @param {Project} project - The project for which to get the time display.
 * @returns {string} The formatted time string in `HH:mm` format, or an empty string if no time is recorded.
 */
export const getProjectTimeDisplay = (state: DailyRecordState | undefined, project: Project) => {
  const projectRecord = state?.projectRecords?.find(record => record.project.id === project.id);
  return projectRecord && projectRecord.timeInMinutes > 0 ? formatTimeInMinutes(projectRecord.timeInMinutes) : '';
}

/**
 * Gets the total time for a specific project from the employee's daily records.
 *
 * @param {EmployeeApprovalState | undefined} state - The state containing the employee's daily records.
 * @param {Project} project - The project for which to get the total time.
 * @returns {string} The formatted total time string in `HH:mm` format, or an empty string if no time is recorded.
 */
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