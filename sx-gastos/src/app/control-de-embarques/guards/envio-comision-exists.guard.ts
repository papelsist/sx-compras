import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromEnvioComision from '../store/actions/envio-comision.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { EnvioComision } from '../model';
import { EnvioComisionService } from '../services';

@Injectable()
export class EnvioComisionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: EnvioComisionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.rembolsoId;
    return this.hasEntityInApi(id);
  }

  /**
   * This method loads a EnvioComision with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasEntityInApi(id: string): Observable<boolean> {
    return of(true);
    /*
    return this.service.get(id).pipe(
      map(comision => new fromEnvioComision.UpsertEnvioComision({ comision })),
      tap(action => this.store.dispatch(action)),
      map(comision => !!comision),
      catchError(() => {
        return of(false);
      })
    );
    */
  }
}
