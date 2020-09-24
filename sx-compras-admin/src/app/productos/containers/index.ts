import { ProductosComponent } from './productos/productos.component';
import { CatalogosPageComponent } from './catalogos-page/catalogos-page.component';
import { LineasComponent } from './lineas/lineas.component';
import { MarcasComponent } from './marcas/marcas.component';
import { ClasesComponent } from './clases/clases.component';
import { ProductoComponent } from './producto/producto.component';
import { GruposComponent } from './grupos/grupos.component';

export const containers: any[] = [
  CatalogosPageComponent,
  ProductosComponent,
  ProductoComponent,
  LineasComponent,
  MarcasComponent,
  ClasesComponent,
  GruposComponent
];

export * from './catalogos-page/catalogos-page.component';
export * from './productos/productos.component';
export * from './producto/producto.component';
export * from './lineas/lineas.component';
export * from './marcas/marcas.component';
export * from './clases/clases.component';
export * from './grupos/grupos.component';
