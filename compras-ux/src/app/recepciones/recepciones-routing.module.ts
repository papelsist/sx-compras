import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionesComponent } from './containers';
import { RecepcionesGuard } from './guards';

const routes: Routes = [
  { path: '', canActivate: [RecepcionesGuard], component: RecepcionesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionesRoutingModule {}
