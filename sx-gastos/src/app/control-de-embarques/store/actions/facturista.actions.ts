import { Action } from '@ngrx/store';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';

export enum FacturistaActionTypes {
  LoadFacturistas = '[FacturistasDeEmbarque Guard] Load facturistas',
  LoadFacturistasFail = '[FacturistasDeEmbarque API] Load facturistas fail',
  LoadFacturistasSuccess = '[FacturistasDeEmbarque API] Load facturistas success'
}

export class LoadFacturistas implements Action {
  readonly type = FacturistaActionTypes.LoadFacturistas;
}
export class LoadFacturistasFail implements Action {
  readonly type = FacturistaActionTypes.LoadFacturistasFail;
  constructor(public payload: { response: any }) {}
}
export class LoadFacturistasSuccess implements Action {
  readonly type = FacturistaActionTypes.LoadFacturistasSuccess;
  constructor(public payload: { facturistas: FacturistaDeEmbarque[] }) {}
}

export type FacturistaActions =
  | LoadFacturistas
  | LoadFacturistasFail
  | LoadFacturistasSuccess;
