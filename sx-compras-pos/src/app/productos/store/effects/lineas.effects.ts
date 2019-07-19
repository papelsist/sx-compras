import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as lineasActions from '../actions/lineas.actions';
import * as fromService from '../../services';
import { LineasService } from '../../services';

@Injectable()
export class LineasEffects {
  constructor(
    private actions$: Actions,
    private lineasService: LineasService
  ) {}

  @Effect()
  loadLineas$ = this.actions$.pipe(
    ofType(lineasActions.LOAD_LINEAS),
    switchMap(() => {
      return this.lineasService.list().pipe(
        map(lineas => new lineasActions.LoadLineasSuccess(lineas)),
        catchError((error: any) => of(new lineasActions.LoadLineasFail(error)))
      );
    })
  );
}
