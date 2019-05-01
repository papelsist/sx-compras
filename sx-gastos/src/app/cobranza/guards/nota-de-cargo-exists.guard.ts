import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromActions from '../store/actions/nota-de-cargo.actions';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { NotaDeCargoService } from '../services/nota-de-cargo.service';

@Injectable({
  providedIn: 'root'
})
export class NotaDeCargoExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private service: NotaDeCargoService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.params.notaId;
    return this.hasInApi(id);
  }

  hasInApi(id: string): Observable<boolean> {
    return this.service.get(id).pipe(
      map(nota => new fromActions.UpsertNotaDeCargo({ nota })),
      tap(action => this.store.dispatch(action)),
      map(action => !!action.payload.nota),
      catchError(() => {
        console.error('Not in AIP Guard error');
        return of(false);
      })
    );
  }
}
