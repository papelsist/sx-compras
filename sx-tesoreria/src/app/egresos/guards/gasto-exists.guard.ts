import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { GastosService } from '../services';

@Injectable()
export class GastoExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: GastosService
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
      map(requisicion => new fromStore.UpsertGasto({ requisicion })),
      // tap(action => console.log('Req in api dispatchin action: ', action)),
      tap(action => this.store.dispatch(action)),
      map(requisicion => !!requisicion),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['egresos/gastos'] }));
        return of(false);
      })
    );
  }
}
