import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as containers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: containers.OrdenesPageComponent,
    children: [
      {
        path: 'compras',
        canActivate: [fromGuards.ComprasGuard],
        children: [
          { path: '', component: containers.ComprasComponent },
          { path: 'create', component: containers.CompraComponent },
          { path: ':compraId', component: containers.CompraComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesRoutingModule {}
