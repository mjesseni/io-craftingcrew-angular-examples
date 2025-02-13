import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {selectAllTodos, selectLoading} from "../../../store/todo.selectors";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {loadTodos} from "../../../store/todo.actions";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ButtonDirective} from "primeng/button";

@Component({
  selector: 'app-todo-list',
  imports: [
    PrimeTemplate,
    TableModule,
    ButtonDirective
  ],
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {
  protected readonly todos$ = this.store.selectSignal(selectAllTodos);
  protected readonly loading$ = this.store.selectSignal(selectLoading);

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit() {
    this.store.dispatch(loadTodos());
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['todo/detail', id]).then();
  }
}
