import { ProductosGuard } from './productos.guard';
import { ProductoExistsGuard } from './producto-exists.guard';
import { LineasGuard } from './lineas.guard';
import { MarcasGuard } from './marcas.guard';
import { ClasesGuard } from './clases.guard';
import { GruposGuard } from './grupos.guard';

export const guards: any[] = [
  ProductosGuard,
  ProductoExistsGuard,
  LineasGuard,
  MarcasGuard,
  ClasesGuard,
  GruposGuard
];

export * from './productos.guard';
export * from './producto-exists.guard';
export * from './lineas.guard';
export * from './marcas.guard';
export * from './clases.guard';
export * from './grupos.guard';
