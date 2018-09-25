import { ProductosGuard } from './productos.guard';
import { ProductoExistsGuard } from './producto-exists.guard';
import { LineasGuard } from './lineas.guard';
import { MarcasGuard } from './marcas.guard';
import { ClasesGuard } from './clases.guard';

export const guards: any[] = [
  ProductosGuard,
  ProductoExistsGuard,
  LineasGuard,
  MarcasGuard,
  ClasesGuard,
];

export * from './productos.guard';
export * from './producto-exists.guard';
export * from './lineas.guard';
export * from './marcas.guard';
export * from './clases.guard';
