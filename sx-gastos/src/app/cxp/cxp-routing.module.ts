import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.CxpPageComponent,
    children: [
      {
        path: 'cfdis',
        canActivate: [fromGuards.CfdisGuard],
        component: fromContainers.CfdisComponent,
        children: []
      },
      {
        path: 'facturas',
        canActivate: [fromGuards.FacturasGuard],
        component: fromContainers.FacturasComponent
      },
      {
        path: 'requisiciones',
        canActivate: [fromGuards.RequisicionesGuard],
        children: [
          { path: '', component: fromContainers.RequisicionesComponent },
          { path: 'create', component: fromContainers.RequisicionComponent },
          {
            path: ':requisicionId',
            canActivate: [fromGuards.RequisicionExistsGuard],
            component: fromContainers.RequisicionComponent
          }
        ]
      },
      {
        path: 'pagos',
        canActivate: [fromGuards.PagosGuard],
        children: [
          { path: '', component: fromContainers.PagosComponent },
          {
            path: ':pagoId',
            canActivate: [fromGuards.PagoExistsGuard],
            component: fromContainers.PagoComponent
          }
        ]
      },
      {
        path: 'notas',
        canActivate: [fromGuards.NotasGuard],
        children: [
          { path: '', component: fromContainers.NotasComponent },
          {
            path: ':notaId',
            canActivate: [fromGuards.NotaExistsGuard],
            component: fromContainers.NotaComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CxpRoutingModule {}
