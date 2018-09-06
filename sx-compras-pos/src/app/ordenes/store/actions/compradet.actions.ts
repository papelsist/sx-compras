import { Action } from '@ngrx/store';
import { CompraDet } from '../../models/compraDet';

export enum CompraDetActionTypes {
  LoadComprasDet = '[CompraDet] Load ComprasDet',
  LoadComprasDetFail = '[CompraDet] Load ComprasDet fail',
  LoadComprasDetSuccess = '[CompraDet] Load ComprasDet Success'
}

export class LoadComprasDet implements Action {
  readonly type = CompraDetActionTypes.LoadComprasDet;
}
export class LoadComprasDetFail implements Action {
  readonly type = CompraDetActionTypes.LoadComprasDetFail;
  constructor(public payload: any) {}
}
export class LoadComprasDetSuccess implements Action {
  readonly type = CompraDetActionTypes.LoadComprasDetSuccess;

  constructor(public payload: CompraDet[]) {}
}

export type CompraActions =
  | LoadComprasDet
  | LoadComprasDetFail
  | LoadComprasDetSuccess;
