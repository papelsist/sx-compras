import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import * as containers from './pages';

import { BonificacionesGuard } from './guards/bonificaciones.guard';
import { BonificacionExistsGuard } from './guards/bonificacion-exists.guard';

export const routes: Route[] = [
  {
    path: 'bonificaciones',
    component: containers.BonificacionesComponent,
    canActivate: [BonificacionesGuard]
  },
  {
    path: 'bonificaciones/edit/:notaId',
    canActivate: [BonificacionExistsGuard],
    component: containers.BonificacionEditPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasRoutingModule {}
