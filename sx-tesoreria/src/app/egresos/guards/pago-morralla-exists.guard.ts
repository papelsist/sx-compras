import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { PagoDeMorrallaService } from '../services';

@Injectable()
export class PagoMorrallaExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: PagoDeMorrallaService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.pagoId;
    return this.hasEntityInApi(id);
  }

  /**
   * This method loads a pago de morralla with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(pago => new fromStore.UpsertPagoDeMorralla({ pago })),
      tap(action => this.store.dispatch(action)),
      map(pago => !!pago),
      catchError(() => {
        this.store.dispatch(
          new fromRoot.Go({ path: ['egresos/pagoMorrallas'] })
        );
        return of(false);
      })
    );
  }
}
