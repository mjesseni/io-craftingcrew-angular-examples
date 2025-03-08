export interface Day {
  date: Date,
  dayOfMonth: number;
  shortDayOfWeek: string;
  weekend: boolean;
}

export interface Team {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  initials: string;
  team: Team;
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
