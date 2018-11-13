import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { InversionActionTypes } from '../actions/inversion.actions';
import * as fromActions from '../actions/inversion.actions';
import { getInversionesFilter } from '../../store/selectors/inversion.selectors';

import { InversionService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class InversionesEffects {
  constructor(
    private actions$: Actions,
    private service: InversionService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetInversionesFilter>(
      InversionActionTypes.SetInversionesFilter
    ),
    map(action => new fromActions.LoadInversiones())
  );

  @Effect()
  loadInversiones$ = this.actions$.pipe(
    ofType(InversionActionTypes.LoadInversiones),
    switchMap(() => {
      return this.store.pipe(
        select(getInversionesFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(
          inversiones => new fromActions.LoadInversionesSuccess({ inversiones })
        ),
        catchError(error =>
          of(new fromActions.InversionError({ response: error }))
        )
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateInversion>(InversionActionTypes.CreateInversion),
    map(action => action.payload.inversion),
    switchMap(inversion => {
      return this.service.save(inversion).pipe(
        map(res => new fromActions.CreateInversionSuccess({ inversion: res })),
        catchError(error =>
          of(new fromActions.InversionError({ response: error }))
        )
      );
    })
  );

  @Effect()
  retorno$ = this.actions$.pipe(
    ofType<fromActions.RetornoInversion>(InversionActionTypes.RetornoInversion),
    map(action => action.payload.update),
    switchMap(inversion => {
      return this.service.retorno(inversion).pipe(
        map(res => new fromActions.UpdateInversionSuccess({ inversion: res })),
        catchError(error =>
          of(new fromActions.InversionError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteInversion>(InversionActionTypes.DeleteInversion),
    map(action => action.payload.inversion),
    switchMap(inversion => {
      return this.service.delete(inversion).pipe(
        map(res => new fromActions.DeleteInversionSuccess({ inversion })),
        catchError(error =>
          of(new fromActions.InversionError({ response: error }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateInversion>(InversionActionTypes.UpdateInversion),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(inversion => new fromActions.UpdateInversionSuccess({ inversion })),
        catchError(error =>
          of(new fromActions.InversionError({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<
      fromActions.CreateInversionSuccess | fromActions.UpdateInversionSuccess
    >(
      InversionActionTypes.CreateInversionSuccess,
      InversionActionTypes.UpdateInversionSuccess
    ),
    map(action => action.payload.inversion),
    tap(rembolso =>
      this.snackBar.open(
        `Inversion ${rembolso.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.InversionError>(InversionActionTypes.InversionError),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
