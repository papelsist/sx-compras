import { CobrosEffects } from './cobros.effects';
import { ChequeDevueltoEffects } from './cheque-devuelto.effects';
import { FichaEffects } from './fichas.effects';

export const effects: any[] = [
  CobrosEffects,
  ChequeDevueltoEffects,
  FichaEffects
];

export * from './cobros.effects';
export * from './cheque-devuelto.effects';
