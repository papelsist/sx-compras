import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  OrdenesComponent,
  OrdenDeCompraComponent,
  OrdenesPendientesComponent
} from './containers';
import { OrdenResolver } from './containers/orden-de-compra/orden.resolver';

const routes: Routes = [
  {
    path: '',
    component: OrdenesComponent,
    children: [
      { path: 'pendientes', component: OrdenesPendientesComponent },
      { path: 'pendientes/create', component: OrdenDeCompraComponent },
      {
        path: ':id',
        component: OrdenDeCompraComponent,
        resolve: { orden: OrdenResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [OrdenResolver]
})
export class OrdenesRoutingModule {}
