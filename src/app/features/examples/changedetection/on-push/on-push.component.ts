import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Counter} from "../model/examples.model";
import {Panel} from "primeng/panel";
import {CounterDisplayComponent} from "../counter-display/counter-display.component";

@Component({
  imports: [
    Panel,
    CounterDisplayComponent
  ],
  styleUrls: ['./on-push.component.scss'],
  templateUrl: './on-push.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushComponent {

  protected counter: Counter = {value: 0};

  constructor() {
    setInterval(() => {
      this.counter.value++;
    }, 250)
  }
}
