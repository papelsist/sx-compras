import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';
import { RequisicionDeMaterialService } from '../services/requisicion-de-material.service';

@Injectable({ providedIn: 'root' })
export class RequisicionMaterialExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: RequisicionDeMaterialService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.requisicionId;
        return this.hasCompraInApi(id);
      })
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.selectRequisicionesLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadRequisicionesDeMaterial());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasCompraInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(
        requisicion =>
          new fromStore.UpsertRrequisicionDeMaterial({ requisicion })
      ),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.requisicion),
      catchError(error => {
        console.error('Error al navegar a requisicion: ', id, error);
        return of(false);
      })
    );
  }
}
