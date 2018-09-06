import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/recepcion.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { RecepcionDeCompraService } from '../services';

@Injectable()
export class RecepcionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: RecepcionDeCompraService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.comId;
        return this.hasComInApi(id);
      })
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getComsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadComs());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasComInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(com => new fromActions.UpsertRecepcionDeCompra({ com })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.com),
      catchError(() => {
        return of(false);
      })
    );
  }
}
