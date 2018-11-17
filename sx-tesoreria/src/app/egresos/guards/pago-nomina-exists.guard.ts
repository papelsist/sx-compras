import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { PagoDeNominaService } from '../services';

@Injectable()
export class PagoNominaExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: PagoDeNominaService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.pagoId;
    return this.hasEntityInApi(id);
  }

  /**
   * This method loads a requisicion with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(pago => new fromStore.UpsertPagoDeNomina({ pago })),
      tap(action => this.store.dispatch(action)),
      map(requisicion => !!requisicion),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['egresos/pagoNominas'] }));
        return of(false);
      })
    );
  }
}
