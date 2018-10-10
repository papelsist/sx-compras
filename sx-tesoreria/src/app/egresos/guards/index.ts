import { GastosGuard } from './gastos.guard';
import { GastoExistsGuard } from './gasto-exists.guard';
import { ComprasGuard } from './compras.guard';
import { CompraExistsGuard } from './compra-exits.guard';
import { ChequesGuard } from './cheques.guard';

export const guards: any[] = [
  GastosGuard,
  GastoExistsGuard,
  ComprasGuard,
  CompraExistsGuard,
  ChequesGuard
];

export * from './gastos.guard';
export * from './gasto-exists.guard';
export * from './compras.guard';
export * from './compra-exits.guard';
export * from './cheques.guard';
