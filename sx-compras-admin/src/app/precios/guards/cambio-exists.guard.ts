import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { CambioDePrecio } from '../models';
import { CambiosDePrecioService } from '../services/cambios-de-precio.service';

@Injectable({ providedIn: 'root' })
export class CambioExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: CambiosDePrecioService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.cambioId;
    return this.hasCompraInApi(id);
  }

  hasCompraInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(cambio => new fromActions.UpsertCambioDePrecio({ cambio })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.cambio),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['cambios-de-precio'] }));
        return of(false);
      })
    );
  }
}
