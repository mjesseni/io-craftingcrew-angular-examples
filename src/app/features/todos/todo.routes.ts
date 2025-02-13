import {Routes} from "@angular/router";
import {TodoListComponent} from "./components/todo/todo-list/todo-list.component";
import {TodoDetailComponent} from "./components/todo/todo-detail/todo-detail.component";

export const todoRoutes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: TodoListComponent},
  {path: 'detail/:id', component: TodoDetailComponent},
];