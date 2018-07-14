import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';

import * as fromStore from '../store';

@Injectable()
export class ProveedorProductosGuard implements CanActivate {
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.parent.params.proveedorId;
    return this.checkStore(id).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(proveedorId: string): Observable<boolean> {
    this.store.dispatch(new fromStore.LoadProveedorProductos(proveedorId));
    return this.store.select(fromStore.getProveedorProductosLoaded).pipe(
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }
}
