import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AppLayoutComponent} from './shared';
import {todoRoutes} from "./features/todos/components/todo/todo.routes";

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {path: '', data: {breadcrumb: 'Home'}, component: HomeComponent},
      {path: 'todo', data: {breadcrumb: 'Todo'}, children: todoRoutes},
    ]
  }
];
