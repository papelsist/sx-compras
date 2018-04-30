import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ProductosComponent,
  CatalogosPageComponent,
  LineasComponent,
  MarcasComponent,
  ClasesComponent,
  ProductoComponent,
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: CatalogosPageComponent,
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'productos/create', component: ProductoComponent },
      { path: 'productos/:productoId', component: ProductoComponent },
      { path: 'lineas', component: LineasComponent },
      { path: 'marcas', component: MarcasComponent },
      { path: 'clases', component: ClasesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductosRoutingModule {}
