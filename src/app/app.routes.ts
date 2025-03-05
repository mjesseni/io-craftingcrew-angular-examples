import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AppLayoutComponent} from './shared';
import {todoRoutes} from "./features/todos/todo.routes";
import {examplesRoutes} from "./features/examples/examples.routes";
import {clockingRoutes} from "./features/clocking/clocking.routes";

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {path: '', data: {breadcrumb: 'Home'}, component: HomeComponent},
      {path: 'todo', data: {breadcrumb: 'Todo'}, children: todoRoutes},
      {path: 'clocking', data: {breadcrumb: 'Clocking'}, children: clockingRoutes},
      {path: 'examples', data: {breadcrumb: 'Examples'}, children: examplesRoutes},
    ]
  }
];
