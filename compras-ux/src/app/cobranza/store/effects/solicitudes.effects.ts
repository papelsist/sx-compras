import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromSolicitudes from '../selectors/solicitudes.selectors';

import { of } from 'rxjs';
import { map, switchMap, catchError, take } from 'rxjs/operators';

import { SolicitudActionTypes } from '../actions/solicitud.actions';
import * as fromActions from '../actions/solicitud.actions';

import { SolicitudService } from '../../services/solicitudes.service';

import { MatSnackBar } from '@angular/material';

@Injectable()
export class SolicitudEffects {
  constructor(
    private actions$: Actions,
    private service: SolicitudService,
    private store: Store<fromStore.State>,
    private snackBar: MatSnackBar
  ) {}

  /*
  @Effect()
  changeFilter$ = this.actions$.pipe(
    ofType<fromActions.SetSolicitudesFilter>(
      SolicitudActionTypes.SetSolicitudesFilter
    ),
    map(action => new fromActions.LoadSolicitudes())
  );
  */

  @Effect()
  loadSolicitudes$ = this.actions$.pipe(
    ofType<fromActions.LoadSolicitudes>(SolicitudActionTypes.LoadSolicitudes),
    map(action => action.payload),
    switchMap(payload =>
      this.service.list(payload.cartera, payload.filter).pipe(
        map(
          solicitudes => new fromActions.LoadSolicitudesSuccess({ solicitudes })
        ),
        catchError(error =>
          of(new fromActions.LoadSolicitudesFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  createSolicitud$ = this.actions$.pipe(
    ofType<fromActions.CreateSolicitud>(SolicitudActionTypes.CreateSolicitud),
    map(action => action.payload.solicitud),
    switchMap(sol =>
      this.service.save(sol).pipe(
        map(solicitud => new fromActions.CreateSolicitudSuccess({ solicitud })),
        catchError(error =>
          of(new fromActions.CreateSolicitudFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  updateSolicitud$ = this.actions$.pipe(
    ofType<fromActions.UpdateSolicitud>(SolicitudActionTypes.UpdateSolicitud),
    map(action => action.payload.update),
    switchMap(sol =>
      this.service.update(sol).pipe(
        map(solicitud => new fromActions.UpdateSolicitudSuccess({ solicitud })),
        catchError(error =>
          of(new fromActions.UpdateSolicitudFail({ response: error }))
        )
      )
    )
  );

  @Effect()
  fail$ = this.actions$.pipe(
    ofType<fromActions.LoadSolicitudesFail>(
      SolicitudActionTypes.LoadSolicitudesFail
    ),
    map(action => action.payload.response),
    // tap(response => console.log('Error: ', response)),
    map(response => new fromRoot.GlobalHttpError({ response }))
  );
}
