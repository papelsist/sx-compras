import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequisicionesComponent } from './pages/requisiciones/requisiciones.component';
import { RequisicionesMaterialGuard } from './guards/requisiciones-material.guard';
import { RequisicionComponent } from './pages/requisicion/requisicion.component';
import { RequisicionMaterialExistsGuard } from './guards/requisicion-material-exists.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [RequisicionesMaterialGuard],
    component: RequisicionesComponent
  },
  {
    path: ':requisicionId',
    canActivate: [RequisicionMaterialExistsGuard],
    component: RequisicionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisicionesMaterialRoutingModule {}
