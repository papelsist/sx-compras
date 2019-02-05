import { CfdisEffects } from './cfdis.effects';
import { CfdisCanceladosEffects } from './cfdis-cancelados.effects';
import { PorCancelarEffects } from './por-cancelar.effects';

export const effects: any[] = [
  CfdisEffects,
  CfdisCanceladosEffects,
  PorCancelarEffects
];

export * from './cfdis.effects';
export * from './cfdis-cancelados.effects';
export * from './por-cancelar.effects';
