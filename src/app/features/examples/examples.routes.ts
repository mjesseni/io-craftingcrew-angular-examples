import {Routes} from "@angular/router";
import {OnPushComponent} from "./changedetection/on-push/on-push.component";
import {DefaultComponent} from "./changedetection/default/default.component";
import {SignalComponent} from "./changedetection/signal/signal.component";
import {RxjsComponent} from "./changedetection/rxjs/rxjs.component";

export const examplesRoutes: Routes = [
  {path: '', redirectTo: 'change/detection/onpush', pathMatch: 'full'},
  {path: 'change/detection/default', component: DefaultComponent},
  {path: 'change/detection/onpush', component: OnPushComponent},
  {path: 'change/detection/rxjs', component: RxjsComponent},
  {path: 'change/detection/signal', component: SignalComponent}
];