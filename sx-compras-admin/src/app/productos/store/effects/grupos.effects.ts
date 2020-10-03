import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as gruposActions from '../actions/grupos.actions';
import { GruposService } from '../../services';

@Injectable()
export class GruposEffects {
  constructor(private actions$: Actions, private service: GruposService) {}

  @Effect()
  loadGrupos$ = this.actions$.pipe(
    ofType(gruposActions.LOAD_GRUPOS),
    switchMap(() => {
      return this.service.list().pipe(
        map(lineas => new gruposActions.LoadGruposSuccess(lineas)),
        catchError((error: any) => of(new gruposActions.LoadGruposFail(error)))
      );
    })
  );

  @Effect()
  createGrupo$ = this.actions$.pipe(
    ofType(gruposActions.CREATE_GRUPO),
    map((action: gruposActions.CreateGrupo) => action.payload),
    switchMap(linea => {
      return this.service.save(linea).pipe(
        map(newLine => new gruposActions.CreateGrupoSuccess(newLine)),
        catchError(error => of(new gruposActions.CreateGrupoFail(error)))
      );
    })
  );

  @Effect()
  updateGrupo$ = this.actions$.pipe(
    ofType(gruposActions.UPDATE_GRUPO),
    map((action: gruposActions.UpdateGrupo) => action.payload),
    switchMap(linea => {
      return this.service.update(linea).pipe(
        map(updatedGrupo => new gruposActions.UpdateGrupoSuccess(updatedGrupo)),
        catchError(error => of(new gruposActions.UpdateGrupoFail(error)))
      );
    })
  );

  @Effect()
  removeGrupo$ = this.actions$.pipe(
    ofType(gruposActions.REMOVE_GRUPO),
    map((action: gruposActions.RemoveGrupo) => action.payload),
    switchMap(linea => {
      return this.service.delete(linea.id).pipe(
        map(() => new gruposActions.RemoveGrupoSuccess(linea)),
        catchError(error => of(new gruposActions.RemoveGrupo(error)))
      );
    })
  );
}
