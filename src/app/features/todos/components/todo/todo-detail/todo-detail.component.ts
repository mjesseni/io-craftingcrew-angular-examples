import {ChangeDetectionStrategy, Component, effect} from '@angular/core';
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {selectLoading, selectSelectedTodo} from "../../../store/todo.selectors";
import {selectTodo, updateTodo} from "../../../store/todo.actions";
import {Panel} from "primeng/panel";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ButtonDirective} from "primeng/button";
import {Checkbox} from "primeng/checkbox";
import {InputText} from "primeng/inputtext";
import {selectRouteParam} from "@craftingcrew/app/shared";
import {Skeleton} from "primeng/skeleton";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-todo-detail',
  imports: [
    Panel,
    ReactiveFormsModule,
    ButtonDirective,
    Checkbox,
    InputText,
    Skeleton,
    NgIf
  ],
  templateUrl: './todo-detail.component.html',
  styleUrl: 'todo-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDetailComponent {
  todoForm: FormGroup = this.fb.group({
    id: [null],
    title: [''],
    description: [''],
    completed: [false],
  });
  protected readonly loading$ = this.store.selectSignal(selectLoading);
  protected readonly todo$ = this.store.selectSignal(selectSelectedTodo);
  protected readonly id$ = this.store.selectSignal(selectRouteParam('id'));

  constructor(private store: Store, private router: Router, private fb: FormBuilder) {
    effect(() => {
      const todo = this.todo$();
      if (todo) {
        this.todoForm.patchValue(todo);
      }
    });
    effect(() => {
      const id = this.id$();
      if (id) {
        this.store.dispatch(selectTodo({id}));
      }
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.store.dispatch(updateTodo({todo: this.todoForm.value}));
      this.router.navigate(['/todo/list']).then();
    }
  }

  onCancel(): void {
    this.router.navigate(['/todo/list']).then();
  }
}
