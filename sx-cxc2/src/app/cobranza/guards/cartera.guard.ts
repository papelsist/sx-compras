import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromActions from '../store/actions/cobro.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { SetCartera } from '../store';

/**
 * Very simple CanActivate Guard to dispatch an Action. The action being the set cartera
 *  SetCartera
 */
@Injectable({
  providedIn: 'root'
})
export class CarteraGuard implements CanActivate {
  constructor(private store: Store<fromStore.State>) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const cartera = route.data.cartera;
    this.store.dispatch(new SetCartera({ cartera }));
    return of(true);
  }
}
