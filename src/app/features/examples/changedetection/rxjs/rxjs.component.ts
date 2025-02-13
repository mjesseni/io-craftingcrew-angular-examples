import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Panel} from "primeng/panel";
import {CounterDisplayComponent} from "../counter-display/counter-display.component";
import {Counter} from "../model/examples.model";
import {BehaviorSubject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AsyncPipe} from "@angular/common";

@Component({
  imports: [
    Panel,
    CounterDisplayComponent,
    AsyncPipe
  ],
  styleUrls: ['./rxjs.component.scss'],
  templateUrl: './rxjs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxjsComponent {

  private counterSubject = new BehaviorSubject<Counter>({value: 0});
  protected counter$ = this.counterSubject.asObservable().pipe(takeUntilDestroyed());

  constructor() {
    // Emit incremented values every second
    setInterval(() => {
      const counter = this.counterSubject.value;
      /* emit a new value */
      this.counterSubject.next({...counter, value: counter.value + 1});
    }, 250);
  }
}
