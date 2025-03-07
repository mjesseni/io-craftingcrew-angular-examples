export interface Day {
  date: Date,
  dayOfMonth: number;
  shortDayOfWeek: string;
  weekend: boolean;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
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
