import { ComprasGuard } from './compras.guard';
import { CompraExistsGuard } from './compra-exists.guard';

export const guards: any[] = [ComprasGuard, CompraExistsGuard];

export * from './compras.guard';
export * from './compra-exists.guard';
