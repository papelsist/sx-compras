import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as containers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: containers.OrdenesPageComponent,
    canActivate: [fromGuards.ComprasGuard],
    children: [
      { path: 'pendientes', component: containers.ComprasComponent },
      { path: 'pendientes/create', component: containers.CompraComponent },
      {
        path: ':id',
        component: containers.CompraComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesRoutingModule {}
