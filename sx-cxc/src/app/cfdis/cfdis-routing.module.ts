import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.CfdisPageComponent,
    children: [
      {
        path: 'generados',
        canActivate: [fromGuards.CfdisGuard],
        component: fromContainers.CfdisComponent
      },
      {
        path: 'porCancelar',
        canActivate: [fromGuards.PorCancelarGuard],
        component: fromContainers.CancelacionesPendientesComponent
      },
      {
        path: 'cancelaciones',
        canActivate: [fromGuards.CfdisCanceladosGuard],
        component: fromContainers.CancelacionesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CfdisRoutingModule {}
