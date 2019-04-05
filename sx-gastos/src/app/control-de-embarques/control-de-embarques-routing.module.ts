import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.EmbarquesPageComponent,
    children: [
      {
        path: 'comisiones',
        canActivate: [fromGuards.EnvioComisionesGuard],
        children: [
          { path: '', component: fromContainers.EnvioComisionesComponent },
          {
            path: ':envioComisionId',
            canActivate: [fromGuards.EnvioComisionExistsGuard],
            component: fromContainers.EnvioComisionComponent
          }
        ]
      },
      {
        path: 'prestamos',
        canActivate: [fromGuards.FacturistasGuard],
        component: fromContainers.PrestamosComponent
      },
      {
        path: 'cargos',
        canActivate: [fromGuards.FacturistasGuard],
        component: fromContainers.CargosComponent
      },
      {
        path: 'cobros',
        loadChildren: 'app/cobros/cobros.module#CobrosModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlDeEmbarquesRoutingModule {}
