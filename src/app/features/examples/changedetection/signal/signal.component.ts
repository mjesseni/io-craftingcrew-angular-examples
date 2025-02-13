import {ChangeDetectionStrategy, Component, signal, WritableSignal} from '@angular/core';
import {Panel} from "primeng/panel";
import {CounterDisplayComponent} from "../counter-display/counter-display.component";
import {Counter} from "../model/examples.model";

@Component({
  imports: [
    Panel,
    CounterDisplayComponent
  ],
  styleUrls: ['./signal.component.scss'],
  templateUrl: './signal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalComponent {

  protected counter$: WritableSignal<Counter> = signal({value: 0});

  constructor() {
    setInterval(() => {
      this.counter$.set({value: this.counter$().value + 1});
    }, 250)
  }
}
