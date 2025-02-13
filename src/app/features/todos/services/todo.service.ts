import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {v4 as uuidv4} from 'uuid';
import {Todo} from "../model/todo.model";

@Injectable({providedIn: 'root'})
export class TodoService {
  todos: Todo[] = [
    {id: '1', title: 'Sample Todo 1', description: 'Description 1', completed: false},
    {id: '2', title: 'Sample Todo 2', description: 'Description 2', completed: true},
  ];

  getTodos(): Observable<Todo[]> {
    return of(this.todos).pipe(delay(500)); // Simulate network delay
  }

  addTodo(todo: Todo): Observable<Todo> {
    const newTodo = {...todo, id: uuidv4()};
    this.todos.push(newTodo);
    return of(newTodo).pipe(delay(500));
  }

  updateTodo(todo: Todo): Observable<Todo> {
    this.todos = this.todos.map((t) => (t.id === todo.id ? todo : t));
    return of(todo).pipe(delay(500));
  }

  deleteTodo(id: string): Observable<string> {
    this.todos = this.todos.filter((t) => t.id !== id);
    return of(id).pipe(delay(500));
  }
}