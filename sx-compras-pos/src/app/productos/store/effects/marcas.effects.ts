import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromMarcas from '../actions/marcas.actions';

import { MarcasService } from '../../services';

@Injectable()
export class MarcasEffects {
  constructor(private service: MarcasService, private actions$: Actions) {}

  @Effect()
  loadMarcas$ = this.actions$.pipe(
    ofType(fromMarcas.LOAD_MARCAS),
    switchMap(() => {
      return this.service.list().pipe(
        map(marcas => new fromMarcas.LoadMarcasSuccess(marcas)),
        catchError((error: any) => of(new fromMarcas.LoadMarcasFail(error)))
      );
    })
  );

  
}
