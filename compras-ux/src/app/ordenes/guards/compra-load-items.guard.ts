import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/compra-items.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { CompraItemsService } from '../services';

@Injectable()
export class CompraLoadItemsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: CompraItemsService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.compraId;
    return this.loadFromApi(id);
  }

  loadFromApi(compraId: string): Observable<boolean> {
    return this.service.list(compraId).pipe(
      map(items => new fromActions.LoadPartidasSuccess({ partidas: items })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.partidas),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['ordenes/compras'] }));
        return of(false);
      })
    );
  }
}
