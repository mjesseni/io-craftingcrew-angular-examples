import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Store} from "@ngrx/store";
import {ClockingTrackingService} from "../../services/clocking-tracking.service";

@Injectable()
export class TrackingEffects {
  constructor(private actions$: Actions, private trackingService: ClockingTrackingService, private store: Store) {
  }
}