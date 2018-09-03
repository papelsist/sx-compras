import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../reducers/application.reducre';
import * as fromApplication from '../actions/application.actions';

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
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  RoutesRecognized
} from '@angular/router';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  RouterCancelAction,
  ROUTER_CANCEL
} from '@ngrx/router-store';

@Injectable()
export class ApplicationsEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromStore.State>
  ) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.store.dispatch(
            new fromApplication.SetGlobalLoading({ loading: true })
          );
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel: {
          this.store.dispatch(
            new fromApplication.SetGlobalLoading({ loading: false })
          );
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  /*
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
  */
  @Effect({ dispatch: false })
  init$: Observable<any> = defer(() => of(null)).pipe(
    tap(() => console.log('Effect inicial de la applicacion: init$'))
  );
}
