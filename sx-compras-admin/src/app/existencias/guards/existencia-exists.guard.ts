import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromActions from '../store/actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { ExistenciaService } from '../services/existencia.service';

@Injectable({ providedIn: 'root' })
export class ExistenciasExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: ExistenciaService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.reciboId;
    return this.hasEntityInApi(id);
  }

  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(existencia => new fromActions.UpsertExistencia({ existencia })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.existencia),
      catchError(e => {
        console.log('Error:_ ', e);
        return of(false);
      })
    );
  }
}
