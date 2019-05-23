import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromActions from '../store/actions/cobro.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { CobroService } from '../services/cobro.service';

@Injectable({
  providedIn: 'root'
})
export class CobroExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: CobroService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.cobroId;
    return this.hasInApi(id);
  }

  hasInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(cobro => new fromActions.UpsertCobro({ cobro })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.cobro),
      catchError(() => {
        console.error('Not in AIP Guard error');
        return of(false);
      })
    );
  }
}
