import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExistenciasComponent } from './pages/existencias/existencias.component';
import { ExistenciasGuard } from './guards/existencias.guard';

const routes: Routes = [
  { path: '', canActivate: [ExistenciasGuard], component: ExistenciasComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExistenciasRoutingModule {}
