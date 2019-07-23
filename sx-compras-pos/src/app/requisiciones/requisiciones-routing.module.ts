import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequisicionesComponent } from './pages/requisiciones/requisiciones.component';

const routes: Routes = [{ path: '', component: RequisicionesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisicionesRoutingModule {}
