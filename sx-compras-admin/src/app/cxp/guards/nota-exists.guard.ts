import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';
import * as fromActions from '../store/actions/notas.actions';

import { Observable, of } from 'rxjs';
import { tap, map, filter, take, switchMap, catchError } from 'rxjs/operators';

import { NotaDeCreditoCxP } from '../model/notaDeCreditoCxP';
import { NotasService } from '../services';

@Injectable()
export class NotaExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.CxpState>,
    private service: NotasService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.notaId;
        return this.hasNotaInApi(id);
      })
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getNotasLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadNotas());
        }
      }),
      filter(loaded => loaded), // Waiting for loaded
      take(1) // End the stream
    );
  }

  hasNotaInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(nota => new fromActions.UpsertNota({ nota: nota })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.nota),
      catchError(() => {
        this.store.dispatch(new fromRoot.Go({ path: ['cxp/notas'] }));
        return of(false);
      })
    );
  }
}
