import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Counter} from "../model/examples.model";

@Component({
  selector: 'app-counter-display',
  imports: [],
  templateUrl: './counter-display.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterDisplayComponent {

  @Input()
  counter: Counter = {value: 0};
}
