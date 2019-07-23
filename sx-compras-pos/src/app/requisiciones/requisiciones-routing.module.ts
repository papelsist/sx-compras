import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequisicionesComponent } from './pages/requisiciones/requisiciones.component';
import { RequisicionesGuard } from './guards/requisiciones.guard';
import { RequisicionComponent } from './pages/requisicion/requisicion.component';
import { RequisicionExistsGuard } from './guards/requisicion-exists.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [RequisicionesGuard],
    component: RequisicionesComponent
  },
  {
    path: ':requisicionId',
    canActivate: [RequisicionExistsGuard],
    component: RequisicionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisicionesRoutingModule {}
