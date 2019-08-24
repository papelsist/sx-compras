import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/facturas.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { CuentaPorPagarService } from '../services';

@Injectable()
export class FacturaExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: CuentaPorPagarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.facturaId;
    return this.hasFacturaInApi(id);
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getFacturasLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadFacturas());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasFacturaInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(factura => new fromActions.UpsertFactura({ factura: factura })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.factura),
      catchError(response => {
        console.log('Error: ', response);
        return of(false);
      })
    );
  }
}
