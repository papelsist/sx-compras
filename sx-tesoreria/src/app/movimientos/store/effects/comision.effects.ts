import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { of } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

import { ComisionActionTypes } from '../actions/comision.actions';
import * as fromActions from '../actions/comision.actions';
import { getComisionesFilter } from '../../store/selectors/comision.selectors';

import { ComisionService } from '../../services';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class ComisionEffects {
  constructor(
    private actions$: Actions,
    private service: ComisionService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetComisionesFilter>(
      ComisionActionTypes.SetComisionesFilter
    ),
    map(action => new fromActions.LoadComisiones())
  );

  @Effect()
  load$ = this.actions$.pipe(
    ofType(ComisionActionTypes.LoadComisiones),
    switchMap(() => {
      return this.store.pipe(
        select(getComisionesFilter),
        take(1)
      );
    }),
    switchMap(filter =>
      this.service.list(filter).pipe(
        map(
          comisiones => new fromActions.LoadComisionesSuccess({ comisiones })
        ),
        catchError(error =>
          of(new fromActions.ComisionError({ response: error }))
        )
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType<fromActions.CreateComision>(ComisionActionTypes.CreateComision),
    map(action => action.payload.comision),
    switchMap(comision => {
      return this.service.save(comision).pipe(
        map(res => new fromActions.CreateComisionSuccess({ comision: res })),
        catchError(error =>
          of(new fromActions.ComisionError({ response: error }))
        )
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<fromActions.DeleteComision>(ComisionActionTypes.DeleteComision),
    map(action => action.payload.comision),
    switchMap(comision => {
      return this.service.delete(comision).pipe(
        map(res => new fromActions.DeleteComisionSuccess({ comision })),
        catchError(error =>
          of(new fromActions.ComisionError({ response: error }))
        )
      );
    })
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType<fromActions.UpdateComision>(ComisionActionTypes.UpdateComision),
    map(action => action.payload.update),
    switchMap(update => {
      return this.service.update(update).pipe(
        map(comision => new fromActions.UpdateComisionSuccess({ comision })),
        catchError(error =>
          of(new fromActions.ComisionError({ response: error }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  success$ = this.actions$.pipe(
    ofType<
      fromActions.CreateComisionSuccess | fromActions.UpdateComisionSuccess
    >(
      ComisionActionTypes.CreateComisionSuccess,
      ComisionActionTypes.UpdateComisionSuccess
    ),
    map(action => action.payload.comision),
    tap(rembolso =>
      this.snackBar.open(
        `Comisión bancaria ${rembolso.id} actualizado exitosamente `,
        'Cerrar',
        {
          duration: 8000
        }
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.ComisionError>(ComisionActionTypes.ComisionError),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
