import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromRembolso from '../store/actions/rembolso.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { Rembolso } from '../model';
import { RembolsoService } from '../services';

@Injectable()
export class RembolsoExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: RembolsoService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.rembolsoId;
    return this.hasEntityInApi(id);
  }

  /**
   * This method loads a requisicion with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(rembolso => new fromRembolso.UpsertRembolso({ rembolso })),
      // tap(action => console.log('Req in api dispatchin action: ', action)),
      tap(action => this.store.dispatch(action)),
      map(requisicion => !!requisicion),
      catchError(() => {
        return of(false);
      })
    );
  }
}
