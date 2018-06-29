import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, take, switchMap, catchError } from 'rxjs/operators';

import { Requisicion } from '../model';
import { RequisicionDeCompraService } from '../services';

@Injectable()
export class RequisicionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.CxpState>,
    private service: RequisicionDeCompraService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.requisicionId;
    // return this.hasEntity(id);
    return this.hasEntityInApi(id);
  }

  /**
   * `hasEntity` composes `hasEntityInStore` and `hasEntityInApi`. It first checks
   * if the book is in store, and if not it then checks if it is in the
   * API.
   */
  hasEntity(id: string): Observable<boolean> {
    return this.hasEntityInStore(id).pipe(
      switchMap(inStore => {
        // console.log('Requisicion in store: ', inStore);
        if (inStore) {
          return of(inStore);
        }
        return this.hasEntityInApi(id);
      })
    );
  }

  hasEntityInStore(id: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getRequisicionEntities),
      map(entities => !!entities[id]),
      take(1)
    );
  }

  /**
   * This method loads a requisicion with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(req => new fromStore.LoadRequisicion(req)),
      // tap(action => console.log('Req in api dispatchin action: ', action)),
      tap(action => this.store.dispatch(action)),
      map(requisicion => !!requisicion),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['cxp/requisiciones'] }));
        return of(false);
      })
    );
  }
}
