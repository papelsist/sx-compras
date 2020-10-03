import { ProductosService } from './productos/productos.service';
import { LineasService } from './lineas/lineas.service';
import { MarcasService } from './marcas/marcas.service';
import { ClasesService } from './clases/clases.service';
import { GruposService } from './grupos.service';

export const services = [
  ProductosService,
  LineasService,
  MarcasService,
  ClasesService,
  GruposService
];

export * from './productos/productos.service';
export * from './lineas/lineas.service';
export * from './marcas/marcas.service';
export * from './clases/clases.service';
export * from './grupos.service';
