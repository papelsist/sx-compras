import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';

import * as fromStore from '../store';
import { Cartera } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CobrosGuard implements CanActivate {
  constructor(private store: Store<fromStore.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const cartera: Cartera = route.data.cartera;
    if (!cartera) {
      console.error('No esta definida la cartera para esta ruta: ', route.url);
      of(false);
    }
    this.store.dispatch(new fromStore.SetSolicitudesCartera({ cartera }));
    return of(true);
    /*
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
    */
  }

  /* NOT USED FOR THIS CASE
  checkStore(): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getCobrosLoaded),
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadCobros());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }
  */
}
