import { GastosGuard } from './gastos.guard';
import { GastoExistsGuard } from './gasto-exists.guard';

export const guards: any[] = [GastosGuard, GastoExistsGuard];

export * from './gastos.guard';
export * from './gasto-exists.guard';
