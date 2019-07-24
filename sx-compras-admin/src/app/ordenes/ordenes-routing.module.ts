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
        path: 'requisiciones',
        loadChildren:
          'app/requisiciones-material/requisiciones-material.module#RequisicionesMaterialModule'
      },
      {
        path: 'compras',
        canActivate: [fromGuards.ComprasGuard],
        children: [
          { path: '', component: containers.ComprasComponent },
          { path: 'create', component: containers.CompraComponent },
          {
            path: ':compraId',
            canActivate: [fromGuards.CompraExistsGuard],
            component: containers.CompraComponent
          }
        ]
      },
      {
        path: 'recepciones',
        loadChildren: 'app/recepciones/recepciones.module#RecepcionesModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesRoutingModule {}
