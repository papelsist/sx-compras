import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromStore from '../store';
import * as fromRecepciones from '../store/recepciones.selectors';
import * as fromActions from '../store/recepciones.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { RecepcionesService } from '../services';

@Injectable()
export class RecepcionExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: RecepcionesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.comId;
    return this.hasComInApi(id);
    /*
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.comId;
        return this.hasComInApi(id);
      })
    );
    */
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromRecepciones.getRecepcionesLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromActions.LoadRecepciones());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasComInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(recepcion => new fromActions.UpsertRecepcion({ recepcion })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.recepcion),
      catchError(() => {
        return of(false);
      })
    );
  }
}
