import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';
const routes: Routes = [
  {
    path: '',
    component: fromContainers.EgresosPageComponent,
    children: [
      {
        path: 'gastos',
        canActivate: [fromGuards.GastosGuard],
        component: fromContainers.GastosComponent
      },
      {
        path: 'gastos/:requisicionId',
        canActivate: [fromGuards.GastoExistsGuard],
        component: fromContainers.GastoComponent
      },
      {
        path: 'compras',
        canActivate: [fromGuards.ComprasGuard],
        component: fromContainers.ComprasComponent
      },
      {
        path: 'compras/:requisicionId',
        canActivate: [fromGuards.CompraExistsGuard],
        component: fromContainers.CompraComponent
      },
      {
        path: 'cheques',
        canActivate: [fromGuards.ChequesGuard],
        children: [{ path: '', component: fromContainers.ChequesComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresosRoutingModule {}
