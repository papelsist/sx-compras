import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';

import { Observable } from 'rxjs';
import { tap, map, filter, take, switchMap } from 'rxjs/operators';

import { Proveedor } from '../models/proveedor';

@Injectable()
export class ProveedorExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.proveedorId;
        return this.hasProveedor(id);
      })
    );
  }

  hasProveedor(id: string): Observable<boolean> {
    return this.store.select(fromStore.getProveedoresEntities).pipe(
      map((entities: { [key: string]: Proveedor }) => !!entities[id]),
      tap(found => {
        if (found) {
          this.store.dispatch(new fromStore.SetCurrentProveedor(id));
        }
      }),
      take(1)
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getProveedoresLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadProveedores());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }
}
