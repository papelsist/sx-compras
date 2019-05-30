import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import * as containers from './containers';

import { CobroExistsGuard } from './guards/cobro-exist.guard';
import { NotaDeCargoExistsGuard } from './guards/nota-de-cargo-exists.guard';

import { CarteraGuard } from './guards/cartera.guard';

export const routes: Route[] = [
  {
    path: '',
    component: containers.CobranzaPageComponent,
    data: { cartera: 'CRE' },
    canActivate: [CarteraGuard],
    children: [
      {
        path: 'cobros',
        component: containers.CobrosComponent
      },
      {
        path: 'cobros/:cobroId',
        canActivate: [CobroExistsGuard],
        component: containers.CobroComponent
      },
      {
        path: 'solicitudes',
        component: containers.SolicitudesComponent
      },
      {
        path: 'notas-de-cargo',
        // data: { cartera: new Cartera('CHO', 'CHOFER') },
        component: containers.NotasDeCargoComponent
      },
      {
        path: 'notas-de-cargo/:notaId',
        canActivate: [NotaDeCargoExistsGuard],
        component: containers.NotaDeCargoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobranzaRoutingModule {}
