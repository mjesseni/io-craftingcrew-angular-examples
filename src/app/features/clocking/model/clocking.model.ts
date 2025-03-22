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
  FINISHED,
  COMPLETED,
  APPROVED
}

export enum WorkingStatus {
  WORKING,
  HOLIDAY,
  SICK
}

export enum WorkEntryKind {
  OFFICE,
  HOMEOFFICE,
  TRAVEL_ACTIVE,
  TRAVEL_PASSIVE,
  DOCTOR_VISIT,
  SICK_LEAVE,
  VACATION,
  COMPENSATION
}
