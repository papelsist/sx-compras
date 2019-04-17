import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import * as containers from './containers';
import { CobrosGuard } from './guards/cobros.guard';
import { SolicitudesGuard } from './guards/solicitudes.guard';
import { Cartera, CARTERAS } from './models';
import { CobroExistsGuard } from './guards/cobro-exist.guard';

export const routes: Route[] = [
  {
    path: '',
    component: containers.CobranzaPageComponent,
    children: [
      {
        path: 'cobros',
        data: { cartera: CARTERAS.CHO },
        component: containers.CobrosComponent
      },
      {
        path: 'cobros/:cobroId',
        canActivate: [CobroExistsGuard],
        component: containers.CobroComponent
      },
      {
        path: 'solicitudes',
        data: { cartera: CARTERAS.CHO },
        component: containers.SolicitudesComponent
      },
      {
        path: 'notas-de-cargo',
        data: { cartera: CARTERAS.CRE },
        component: containers.NotasDeCargoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobranzaRoutingModule {}
