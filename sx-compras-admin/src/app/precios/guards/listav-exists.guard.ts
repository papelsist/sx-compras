import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { ListaDePreciosVentaService } from '../services/lista-de-precios-venta.service';

@Injectable({ providedIn: 'root' })
export class ListavExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: ListaDePreciosVentaService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.listaId;
    return this.hasCompraInApi(id);
  }

  hasCompraInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(lista => new fromActions.UpsertLista({ lista })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.lista),
      catchError(() => {
        return of(false);
      })
    );
  }
}
