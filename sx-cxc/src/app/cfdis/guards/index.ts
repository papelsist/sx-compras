import { CfdisGuard } from './cfdis.guard';
import { CfdisCanceladosGuard } from './cfdis-cancelados.guard';
import { PorCancelarGuard } from './por-cancelar.guard';

export const guards: any[] = [
  CfdisGuard,
  CfdisCanceladosGuard,
  PorCancelarGuard
];

export * from './cfdis.guard';
export * from './cfdis-cancelados.guard';
export * from './por-cancelar.guard';
