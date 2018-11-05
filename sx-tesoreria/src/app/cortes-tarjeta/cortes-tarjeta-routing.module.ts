import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import { CorteResolver } from './services';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.CortesComponent,
    children: [
      {
        path: 'pendientes',
        component: fromContainers.CortesPendientesComponent
      },
      {
        path: 'registrados',
        component: fromContainers.CortesRegistradosComponent
      },
      {
        path: ':id',
        component: fromContainers.CorteComponent,
        resolve: { corte: CorteResolver }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CortesTarjetaRoutingModule {}
