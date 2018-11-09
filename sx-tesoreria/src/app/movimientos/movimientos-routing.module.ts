import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.MovimientosPageComponent,
    children: [
      {
        path: 'traspasos',
        canActivate: [fromGuards.TraspasosGuard],
        component: fromContainers.TraspasosComponent
      },
      {
        path: 'inversiones',
        canActivate: [fromGuards.InversionesGuard],
        component: fromContainers.InversionesComponent
      },
      {
        path: 'tesoreria',
        canActivate: [fromGuards.MovimientosGuard],
        component: fromContainers.MovimientosTesComponent
      },
      {
        path: 'comisiones',
        canActivate: [fromGuards.ComisionGuard],
        component: fromContainers.ComisionesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosRoutingModule {}
