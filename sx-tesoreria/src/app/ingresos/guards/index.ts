import { CobrosGuard } from './cobros.guard';
import { ChequesDevueltosGuard } from './cheques-devueltos.guard';
import { FichasGuard } from './fichas.guard';
import { ChequesDevueltoExistsGuard } from './cheque-devuelto.exists.guard';

export const guards: any[] = [
  CobrosGuard,
  ChequesDevueltosGuard,
  FichasGuard,
  ChequesDevueltoExistsGuard
];

export * from './cobros.guard';
export * from './cheques-devueltos.guard';
export * from './fichas.guard';
export * from './cheque-devuelto.exists.guard';
