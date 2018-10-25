import { GastosGuard } from './gastos.guard';
import { GastoExistsGuard } from './gasto-exists.guard';
import { ComprasGuard } from './compras.guard';
import { CompraExistsGuard } from './compra-exits.guard';
import { ChequesGuard } from './cheques.guard';
import { RembolsosGuard } from './rembolsos.guard';
import { RembolsoExistsGuard } from './rembolso-exists.guard';

export const guards: any[] = [
  GastosGuard,
  GastoExistsGuard,
  ComprasGuard,
  CompraExistsGuard,
  ChequesGuard,
  RembolsosGuard,
  RembolsoExistsGuard
];

export * from './gastos.guard';
export * from './gasto-exists.guard';
export * from './compras.guard';
export * from './compra-exits.guard';
export * from './cheques.guard';
export * from './rembolsos.guard';
export * from './rembolso-exists.guard';
