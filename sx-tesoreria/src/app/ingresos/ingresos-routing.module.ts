import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';
import { ChequesDevueltoExistsGuard } from './guards/cheque-devuelto.exists.guard';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.IngresosPageComponent,
    children: [
      {
        path: 'cobros',
        canActivate: [fromGuards.CobrosGuard],
        component: fromContainers.CobrosComponent
      },
      {
        path: 'chequesdevueltos',
        canActivate: [fromGuards.ChequesDevueltosGuard],
        component: fromContainers.ChequesDevueltosComponent
      },
      {
        path: 'chequesdevueltos/:chequeId',
        canActivate: [fromGuards.ChequesDevueltoExistsGuard],
        component: fromContainers.ChequeDevueltoComponent
      },
      {
        path: 'fichas',
        canActivate: [fromGuards.FichasGuard],
        component: fromContainers.FichasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule {}
