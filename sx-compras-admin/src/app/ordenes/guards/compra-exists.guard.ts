import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/compra.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { Compra } from '../models/compra';
import { ComprasService } from '../services';

@Injectable()
export class CompraExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: ComprasService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.compraId;
    return this.hasCompraInApi(id);
    /*
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.compraId;
        return this.hasCompraInApi(id);
      })
    );
    */
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getComprasLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadCompras());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasCompraInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(compra => new fromActions.UpsertCompra({ compra: compra })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.compra),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['ordenes/compras'] }));
        return of(false);
      })
    );
  }
}
