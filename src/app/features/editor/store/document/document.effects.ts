import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class DocumentEffects {
  private actions$ = inject(Actions);
}