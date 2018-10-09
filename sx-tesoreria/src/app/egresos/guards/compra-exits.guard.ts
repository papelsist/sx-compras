import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { ComprasService } from '../services';

@Injectable()
export class CompraExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: ComprasService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.requisicionId;
    return this.hasEntityInApi(id);
  }

  /**
   * This method loads a requisicion with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(requisicion => new fromStore.UpsertCompra({ requisicion })),
      tap(action => this.store.dispatch(action)),
      map(requisicion => !!requisicion),
      catchError(() => {
        return of(false);
      })
    );
  }
}
