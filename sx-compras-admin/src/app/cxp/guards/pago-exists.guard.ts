import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/pagos.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { PagosService } from '../services';

@Injectable()
export class PagoExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.CxpState>,
    private service: PagosService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.pagoId;
        return this.hasPagoInApi(id);
      })
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getPagosLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadPagos());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasPagoInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(pago => new fromActions.UpsertPago({ pago })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.pago),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['cxp/pagos'] }));
        return of(false);
      })
    );
  }
}
