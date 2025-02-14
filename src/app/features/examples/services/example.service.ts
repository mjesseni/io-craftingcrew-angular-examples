import {Injectable} from "@angular/core";
import {interval, Observable, of, take} from "rxjs";
import {delay, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  private getRandomDelay(): number {
    return Math.random() * 1000 + 1000; // Random delay between 1000ms and 2000ms
  }

  getData1(): Observable<number> {
    return interval(this.getRandomDelay()).pipe(
      map(() => Math.floor(Math.random() * 100))
    );
  }

  getData2(): Observable<number> {
    return interval(this.getRandomDelay()).pipe(
      map(() => Math.floor(Math.random() * 100))
    );
  }

  getData3(): Observable<number> {
    return interval(this.getRandomDelay()).pipe(
      map(() => Math.floor(Math.random() * 100))
    );
  }
}