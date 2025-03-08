import {Routes} from "@angular/router";
import {ClockingApprovalComponent} from "./components/admin/clocking-approval/clocking-approval.component";
import {TimeTrackingComponent} from "./components/employee/time-tracking/time-tracking.component";

export const clockingRoutes: Routes = [
  {path: '', redirectTo: 'employee/tracking', pathMatch: 'full'},
  {
    path: 'admin',
    children: [
      {path: 'approve', component: ClockingApprovalComponent}]
  },
  {
    path: 'employee',
    children: [
      {path: 'tracking', component: TimeTrackingComponent}]
  },
  {path: '**', redirectTo: 'employee/tracking'}
];