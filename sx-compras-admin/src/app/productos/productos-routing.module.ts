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

// Guards
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: CatalogosPageComponent,
    children: [
      {
        path: 'productos',
        canActivate: [fromGuards.ProductosGuard],
        component: ProductosComponent,
      },
      {
        path: 'productos/create',
        canActivate: [
          fromGuards.ProductosGuard,
          fromGuards.LineasGuard,
          fromGuards.MarcasGuard,
          fromGuards.ClasesGuard,
        ],
        component: ProductoComponent,
      },
      {
        path: 'productos/:productoId',
        canActivate: [
          fromGuards.ProductoExistsGuard,
          fromGuards.LineasGuard,
          fromGuards.MarcasGuard,
          fromGuards.ClasesGuard,
        ],
        component: ProductoComponent,
      },
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
