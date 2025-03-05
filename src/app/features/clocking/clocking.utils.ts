import {DailyRecordState} from "./store/clocking.state";

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
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
}

/**
 * Gets the minimum approval state from an array of daily records.
 *
 * @param {DailyRecordState[]} dailyRecords - The array of daily records.
 * @returns {number} The minimum approval state, or Infinity if no approval state is found.
 */
export const getMinApprovalState = (dailyRecords: DailyRecordState[]) => {
  return dailyRecords.map(record => record.approvalStatus ?? Infinity)
    .reduce((min, status) => Math.min(min, status), Infinity);
}