import {addDays, endOfMonth, format, getDate, isWeekend, startOfMonth} from "date-fns";

export interface Day {
  date: Date,
  dayOfMonth: number;
  shortDayOfWeek: string;
  weekend: boolean;
}

export enum ApprovalStatus {
  OPEN,
  COMPLETED,
  APPROVED
}

export enum WorkingStatus {
  WORKING,
  HOLIDAY,
  SICK
}

export interface EmployeeApprovalRecord {
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  approvalStatus: ApprovalStatus;

  normalTimeSum: number;
  normalTimeSumHours: number;
  normalTimeSumMinutes: number;

  workedTimeSum: number;
  workedTimeSumHours: number;
  workedTimeSumMinutes: number;

  dailyRecords?: DailyRecord[]
}

export interface DailyRecord {
  day: Day;
  approvalStatus?: ApprovalStatus;
  workingStatus?: WorkingStatus;

  workedTime?: number;
  normalTime?: number;
  bookedTime?: number;

  workedTimeHours?: number;
  workedTimeMinutes?: number;

  bookedTimeHours?: number;
  bookedTimeMinutes?: number;

  overtime?: boolean;
  overtimeHours?: number;
  overtimeMinutes?: number;

  shortTime?: boolean;
  shortTimeHours?: number;
  shortTimeMinutes?: number;
}

export const getDays = (month: Date): Day[] => {
  const result: Day[] = [];
  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  let currentDay = firstDay;
  while (currentDay <= lastDay) {
    result.push({
      date: currentDay,
      dayOfMonth: getDate(currentDay),
      shortDayOfWeek: format(currentDay, 'E'),
      weekend: isWeekend(currentDay)
    });
    currentDay = addDays(currentDay, 1);
  }
  return result;
}

export const getRandomApprovalStatus = (): ApprovalStatus => {
  const statuses = Object.values(ApprovalStatus).filter(value => typeof value === 'number') as ApprovalStatus[];
  return statuses[Math.floor(Math.random() * statuses.length)] || ApprovalStatus.OPEN;
}

export const getRandomWorkingStatus = (): WorkingStatus => {
  const statuses = Object.values(WorkingStatus).filter(value => typeof value === 'number') as WorkingStatus[];
  return statuses[Math.floor(Math.random() * statuses.length)] || WorkingStatus.WORKING;
}

export const getInitials = (name: string): string => {
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
}

export const createEmployeeApprovalRecord = (employeeId: string, employeeName: string, month: Date): EmployeeApprovalRecord => {
  const days = getDays(month);
  const dailyRecords = days.map(day => {
    if (!day.weekend) {
      const normalTimeMinutes = 7.7 * 60;
      const workedMinutes = Math.floor(Math.random() * 60 * 10);
      const bookedMinutes = Math.floor(Math.random() * workedMinutes);

      const overtimeMinutes = Math.max(0, workedMinutes - normalTimeMinutes); // Overtime when above normal hours
      const shortTimeMinutes = Math.max(0, normalTimeMinutes - workedMinutes); // Short time when below normal hours

      const workedHours = Math.floor(workedMinutes / 60);
      const remainingMinutes = workedMinutes % 60;

      const bookedTimeHours = Math.floor(bookedMinutes / 60);
      const bookedTimeMinutes = bookedMinutes % 60;

      const overtimeHours = Math.floor(overtimeMinutes / 60);
      const overtimeRemainingMinutes = overtimeMinutes % 60;

      const shortTimeHours = Math.floor(shortTimeMinutes / 60);
      const shortTimeRemainingMinutes = shortTimeMinutes % 60;

      return {
        day: day,
        approvalStatus: getRandomApprovalStatus(),
        workingStatus: getRandomWorkingStatus(),

        workedTime: workedMinutes,
        bookedTime: bookedMinutes,
        normalTime: normalTimeMinutes,

        workedTimeHours: workedHours,
        workedTimeMinutes: remainingMinutes,

        bookedTimeHours: bookedTimeHours,
        bookedTimeMinutes: bookedTimeMinutes,

        overtime: overtimeMinutes > 0,
        overtimeHours: overtimeHours,
        overtimeMinutes: overtimeRemainingMinutes,
        shortTime: shortTimeMinutes > 0,
        shortTimeHours: shortTimeHours,
        shortTimeMinutes: shortTimeRemainingMinutes
      }
    } else {
      return {day: day, weekend: true};
    }
  })


  const normalTimeSum = dailyRecords.reduce((sum, record) => sum + (record?.normalTime || 0), 0);
  const workedTimeSum = dailyRecords.reduce((sum, record) => sum + (record?.workedTime || 0), 0);

  const normalTimeSumHours = Math.floor(normalTimeSum / 60);
  const normalTimeSumMinutes = normalTimeSum % 60;
  const workedTimeSumHours = Math.floor(workedTimeSum / 60);
  const workedTimeSumMinutes = workedTimeSum % 60;

  return {
    employeeId: employeeId,
    employeeName: employeeName,
    employeeInitials: getInitials(employeeName),
    approvalStatus: getRandomApprovalStatus(),

    normalTimeSum: normalTimeSum,
    normalTimeSumHours: normalTimeSumHours,
    normalTimeSumMinutes: normalTimeSumMinutes,

    workedTimeSum: workedTimeSum,
    workedTimeSumHours: workedTimeSumHours,
    workedTimeSumMinutes: workedTimeSumMinutes,

    dailyRecords: dailyRecords
  }
};