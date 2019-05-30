import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromActions from '../store/actions/bonificacion.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { NotaDeCreditoService } from '../services/nota-de-credito.service';
import { Bonificacion } from 'app/cobranza/models';

@Injectable({
  providedIn: 'root'
})
export class BonificacionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: NotaDeCreditoService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.notaId;
    return this.hasInApi(id);
  }

  hasInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(
        (bonificacion: Bonificacion) =>
          new fromActions.UpsertBonificacion({ bonificacion })
      ),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.bonificacion),
      catchError(() => {
        console.error('Not in AIP Guard error');
        return of(false);
      })
    );
  }
}
