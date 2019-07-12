import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, filter, take, switchMap, catchError, map } from 'rxjs/operators';

import * as fromCobranza from 'app/cobranza/store';
import * as fromStore from '../store';

@Injectable({
  providedIn: 'root'
})
export class BonificacionesGuard implements CanActivate {
  constructor(private store: Store<fromStore.State>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return combineLatest([
      this.store.pipe(select(fromCobranza.getCartera)),
      this.store.pipe(select(fromStore.getBonificacionLoaded))
    ]).pipe(
      tap(([cartera, loaded]) => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadBonificaciones({ cartera }));
        }
      }),
      map(([cartera, loaded]) => loaded),
      filter(loaded => loaded),
      take(1)
    );
  }
}
