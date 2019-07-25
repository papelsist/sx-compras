import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionesComponent, RecepcionComponent } from './containers';
import { RecepcionesGuard, RecepcionExistsGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [RecepcionesGuard],
    component: RecepcionesComponent
  },
  {
    path: ':comId',
    canActivate: [RecepcionExistsGuard],
    component: RecepcionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionesRoutingModule {}
