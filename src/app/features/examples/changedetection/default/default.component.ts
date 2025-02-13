import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {Checkbox} from "primeng/checkbox";
import {InputText} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {Panel} from "primeng/panel";
import {ReactiveFormsModule} from "@angular/forms";
import {Skeleton} from "primeng/skeleton";
import {Counter} from "../model/examples.model";
import {CounterDisplayComponent} from "../counter-display/counter-display.component";

@Component({
  imports: [
    Panel,
    CounterDisplayComponent
  ],
  styleUrls: ['./default.component.scss'],
  templateUrl: './default.component.html'
})
export class DefaultComponent {

  protected counter: Counter = {value: 0};

  constructor() {
    setInterval(() => {
      this.counter.value++;
    }, 250)
  }
}
