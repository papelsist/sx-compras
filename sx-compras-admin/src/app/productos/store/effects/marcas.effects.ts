import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import * as fromMarcas from '../actions/marcas.actions';

import { MarcasService } from '../../services';

@Injectable()
export class MarcasEffects {
  constructor(private service: MarcasService, private actions$: Actions) {}

  @Effect()
  loadMarcas$ = this.actions$.ofType(fromMarcas.LOAD_MARCAS).pipe(
    switchMap(() => {
      return this.service
        .list()
        .pipe(
          map(marcas => new fromMarcas.LoadMarcasSuccess(marcas)),
          catchError((error: any) => of(new fromMarcas.LoadMarcasFail(error)))
        );
    })
  );
}
