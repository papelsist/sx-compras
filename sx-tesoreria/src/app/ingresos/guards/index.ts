import { CobrosGuard } from './cobros.guard';
import { ChequesDevueltosGuard } from './cheques-devueltos.guard';

export const guards: any[] = [CobrosGuard, ChequesDevueltosGuard];

export * from './cobros.guard';
export * from './cheques-devueltos.guard';
