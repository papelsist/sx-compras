import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

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
  loadLineas$ = this.actions$.ofType(lineasActions.LOAD_LINEAS).pipe(
    switchMap(() => {
      return this.lineasService
        .list()
        .pipe(
          map(lineas => new lineasActions.LoadLineasSuccess(lineas)),
          catchError((error: any) =>
            of(new lineasActions.LoadLineasFail(error))
          )
        );
    })
  );
}
