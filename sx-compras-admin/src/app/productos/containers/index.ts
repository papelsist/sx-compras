import { ProductosComponent } from './productos/productos.component';
import { CatalogosPageComponent } from './catalogos-page/catalogos-page.component';
import { LineasComponent } from './lineas/lineas.component';
import { MarcasComponent } from './marcas/marcas.component';
import { ClasesComponent } from './clases/clases.component';

export const containers: any[] = [
  CatalogosPageComponent,
  ProductosComponent,
  LineasComponent,
  MarcasComponent,
  ClasesComponent
];

export * from './catalogos-page/catalogos-page.component';
export * from './productos/productos.component';
export * from './lineas/lineas.component';
export * from './marcas/marcas.component';
export * from './clases/clases.component';
