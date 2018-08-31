import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';

import {
  LoadSucursal,
  ApplicationActionTypes,
  LoadSucursalSuccess,
  LoadSucursalFail
} from '../actions/application.actions';

import { Observable, defer, of } from 'rxjs';
import { tap, map, mergeMap, catchError } from 'rxjs/operators';

import { Sucursal } from '../../models';

@Injectable()
export class ApplicationsEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  @Effect()
  loadSucursal$ = this.actions$.pipe(
    ofType<LoadSucursal>(ApplicationActionTypes.LoadSucursal),
    map(action => `${action.payload}/sucursal`),
    mergeMap(url => {
      return this.http
        .get<Sucursal>(url)
        .pipe(
          map(sucursal => new LoadSucursalSuccess({ sucursal })),
          catchError(error => of(new LoadSucursalFail(error)))
        );
    })
  );

  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => of(null)).pipe(
    tap(() => console.log('Effect inicial de la applicacion: init$'))
  );
}
