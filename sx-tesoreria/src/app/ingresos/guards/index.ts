import { CobrosGuard } from './cobros.guard';
import { ChequesDevueltosGuard } from './cheques-devueltos.guard';
import { FichasGuard } from './fichas.guard';

export const guards: any[] = [CobrosGuard, ChequesDevueltosGuard, FichasGuard];

export * from './cobros.guard';
export * from './cheques-devueltos.guard';
export * from './fichas.guard';
