import {Routes} from "@angular/router";
import {ClockingApprovalComponent} from "./components/admin/clocking-approval/clocking-approval.component";

export const clockingRoutes: Routes = [
  {path: '', redirectTo: 'approve', pathMatch: 'full'},
  {path: 'approve', component: ClockingApprovalComponent},
];