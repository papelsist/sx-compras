import { ComprasGuard } from './compras.guard';
import { CompraExistsGuard } from './compra-exists.guard';
import { CompraLoadItemsGuard } from './compra-load-items.guard';

export const guards: any[] = [
  ComprasGuard,
  CompraExistsGuard,
  CompraLoadItemsGuard
];

export * from './compras.guard';
export * from './compra-exists.guard';
export * from './compra-load-items.guard';
