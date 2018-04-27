import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ProductosComponent,
  CatalogosPageComponent,
  LineasComponent,
  MarcasComponent,
  ClasesComponent
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: CatalogosPageComponent,
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'lineas', component: LineasComponent },
      { path: 'marcas', component: MarcasComponent },
      { path: 'clases', component: ClasesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule {}
