import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';

import { Observable } from 'rxjs';
import { tap, map, filter, take, switchMap } from 'rxjs/operators';
import { ListaDePreciosProveedor } from '../models/listaDePreciosProveedor';

@Injectable()
export class ProveedorListaExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.id;
        return this.hasLista(id);
      })
    );
  }

  hasLista(id: string): Observable<boolean> {
    return this.store
      .select(fromStore.getListasEntities)
      .pipe(
        map(
          (entities: { [key: string]: ListaDePreciosProveedor }) =>
            !!entities[id]
        ),
        take(1)
      );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getListasLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          // this.store.dispatch(new fromStore.LoadListasDePreciosProveedor());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }
}
