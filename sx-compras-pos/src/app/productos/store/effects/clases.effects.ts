import { Injectable } from '@angular/core';

import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromClases from '../actions/clases.actions';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { ClasesService } from '../../services';

@Injectable()
export class ClasesEffects {
  constructor(private actions$: Actions, private service: ClasesService) {}

  @Effect()
  loadClases$ = this.actions$.pipe(
    ofType(fromClases.LOAD_CLASES),
    switchMap(() => {
      return this.service.list().pipe(
        map(clases => new fromClases.LoadClasesSuccess(clases)),
        catchError(error => of(new fromClases.LoadClasesFail(error)))
      );
    })
  );
}
