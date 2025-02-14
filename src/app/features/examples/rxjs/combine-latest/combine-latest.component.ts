import {ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {CounterDisplayComponent} from "../../changedetection/counter-display/counter-display.component";
import {Panel} from "primeng/panel";
import {ExampleService} from "../../services/example.service";
import {combineLatest, take} from "rxjs";

@Component({
  selector: 'app-combine-latest',
  imports: [
    CounterDisplayComponent,
    Panel
  ],
  styleUrls: ['./combine-latest.component.scss'],
  templateUrl: './combine-latest.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CombineLatestComponent implements OnInit {

  protected counter$ = signal({value: 0});
  protected completed$ = signal(false);
  protected data1$: WritableSignal<number | undefined> = signal(undefined);
  protected data2$: WritableSignal<number | undefined> = signal(undefined);
  protected data3$: WritableSignal<number | undefined> = signal(undefined);

  constructor(private service: ExampleService) {
  }

  ngOnInit() {
    /* continuous values  */
    combineLatest([this.service.getData1(), this.service.getData2(), this.service.getData3()])
      .pipe(take(1))
      .subscribe({
        next: ([data1, data2, data3]) => {
          this.counter$.set({value: this.counter$().value + 1})
          this.data1$.set(data1);
          this.data2$.set(data2);
          this.data3$.set(data3);
        },
        complete: () => this.completed$.set(true)
      });
  }
}
