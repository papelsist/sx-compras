import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { DevolucionClienteService } from '../services';

@Injectable()
export class DevolucionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: DevolucionClienteService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.devoId;
    return this.hasEntityInApi(id);
  }

  /**
   * This method loads entity with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(devolucion => new fromStore.UpsertDevolucionCliente({ devolucion })),
      tap(action => this.store.dispatch(action)),
      map(pago => !!pago),
      catchError(() => {
        this.store.dispatch(
          new fromRoot.Go({ path: ['egresos/devolucionCliente'] })
        );
        return of(false);
      })
    );
  }
}
