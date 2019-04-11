import { Action } from '@ngrx/store';

import { SolicitudDeDeposito, CarteraFilter, Cartera } from '../../models';
import { Update } from '@ngrx/entity';

export enum SolicitudActionTypes {
  SetSolicitudesCartera = '[Solicitudes Component ] Set Solicitudes Cartera',
  SetSolicitudesFilter = '[Solicitudes Component ] Set Solicitudes filter',
  SetSolicitudesSearchTerm = '[Solicitudes Component] Set Solicitudes term',
  LoadSolicitudes = '[Solicitudes Guard] Load Solicitudes',
  LoadSolicitudesFail = '[Solicitud API] Load Solicitudes fail',
  LoadSolicitudesSuccess = '[Solicitud API] Load Solicitudes Success',
  // Create
  CreateSolicitud = '[Solicitudes effect] Create solicitud',
  CreateSolicitudFail = '[Solicitudes effect] Create solicitud fail',
  CreateSolicitudSuccess = '[Solicitudes effect] Create solicitud success',
  // Update
  UpdateSolicitud = '[Solicitudes effect] Update solicitud',
  UpdateSolicitudFail = '[Solicitudes effect] Update solicitud fail',
  UpdateSolicitudSuccess = '[Solicitudes effect] Update solicitud success'
}

export class SetSolicitudesCartera implements Action {
  readonly type = SolicitudActionTypes.SetSolicitudesCartera;
  constructor(public payload: { cartera: Cartera }) {}
}

export class SetSolicitudesFilter implements Action {
  readonly type = SolicitudActionTypes.SetSolicitudesFilter;
  constructor(public payload: { filter: CarteraFilter }) {}
}

export class SetSolicitudesSearchTerm implements Action {
  readonly type = SolicitudActionTypes.SetSolicitudesSearchTerm;
  constructor(public payload: { term: string }) {}
}

export class LoadSolicitudes implements Action {
  readonly type = SolicitudActionTypes.LoadSolicitudes;
  constructor(public payload: { cartera: string; filter?: CarteraFilter }) {}
}

export class LoadSolicitudesFail implements Action {
  readonly type = SolicitudActionTypes.LoadSolicitudesFail;
  constructor(public payload: { response: any }) {}
}
export class LoadSolicitudesSuccess implements Action {
  readonly type = SolicitudActionTypes.LoadSolicitudesSuccess;

  constructor(public payload: { solicitudes: SolicitudDeDeposito[] }) {}
}

export class CreateSolicitud implements Action {
  readonly type = SolicitudActionTypes.CreateSolicitud;
  constructor(public payload: { solicitud: SolicitudDeDeposito }) {}
}
export class CreateSolicitudFail implements Action {
  readonly type = SolicitudActionTypes.CreateSolicitudFail;
  constructor(public payload: { response: any }) {}
}
export class CreateSolicitudSuccess implements Action {
  readonly type = SolicitudActionTypes.CreateSolicitudSuccess;
  constructor(public payload: { solicitud: SolicitudDeDeposito }) {}
}
// Update
export class UpdateSolicitud implements Action {
  readonly type = SolicitudActionTypes.UpdateSolicitud;
  constructor(public payload: { update: Update<SolicitudDeDeposito> }) {}
}
export class UpdateSolicitudFail implements Action {
  readonly type = SolicitudActionTypes.UpdateSolicitudFail;
  constructor(public payload: { response: any }) {}
}
export class UpdateSolicitudSuccess implements Action {
  readonly type = SolicitudActionTypes.UpdateSolicitudSuccess;
  constructor(public payload: { solicitud: SolicitudDeDeposito }) {}
}

export type SolicitudActions =
  | SetSolicitudesCartera
  | SetSolicitudesFilter
  | SetSolicitudesSearchTerm
  | LoadSolicitudes
  | LoadSolicitudesFail
  | LoadSolicitudesSuccess
  | CreateSolicitud
  | CreateSolicitudFail
  | CreateSolicitudSuccess
  | UpdateSolicitud
  | UpdateSolicitudFail
  | UpdateSolicitudSuccess;
