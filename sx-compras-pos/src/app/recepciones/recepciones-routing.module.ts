import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromGuards from './guards';
import * as fromContainers from './containers';

const routes: Routes = [
  {
    path: '',
    canActivate: [fromGuards.RecepcionesGuard],
    component: fromContainers.ComsComponent
  },
  {
    path: 'create',
    component: fromContainers.ComCreateComponent
  },
  {
    path: ':comId',
    canActivate: [fromGuards.RecepcionExistsGuard],
    component: fromContainers.ComComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionesRoutingModule {}
