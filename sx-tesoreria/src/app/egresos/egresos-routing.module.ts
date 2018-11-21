import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';
const routes: Routes = [
  {
    path: '',
    component: fromContainers.EgresosPageComponent,
    children: [
      {
        path: 'gastos',
        canActivate: [fromGuards.GastosGuard],
        component: fromContainers.GastosComponent
      },
      {
        path: 'gastos/:requisicionId',
        canActivate: [fromGuards.GastoExistsGuard],
        component: fromContainers.GastoComponent
      },
      {
        path: 'compras',
        canActivate: [fromGuards.ComprasGuard],
        component: fromContainers.ComprasComponent
      },
      {
        path: 'compras/:requisicionId',
        canActivate: [fromGuards.CompraExistsGuard],
        component: fromContainers.CompraComponent
      },
      {
        path: 'rembolsos',
        canActivate: [fromGuards.RembolsosGuard],
        children: [
          { path: '', component: fromContainers.RembolsosComponent },
          {
            path: ':rembolsoId',
            canActivate: [fromGuards.RembolsoExistsGuard],
            component: fromContainers.RembolsoComponent
          }
        ]
      },
      {
        path: 'comprasMoneda',
        canActivate: [fromGuards.CompraMonedasGuard],
        component: fromContainers.ComprasMonedaComponent
      },
      {
        path: 'pagoNominas',
        canActivate: [fromGuards.PagoNominasGuard],
        component: fromContainers.PagoNominasComponent
      },
      {
        path: 'pagoNominas/:pagoId',
        canActivate: [fromGuards.PagoNominaExistsGuard],
        component: fromContainers.PagoDeNominaComponent
      },
      {
        path: 'pagoMorralla',
        canActivate: [fromGuards.PagoMorrallasGuard],
        component: fromContainers.PagoMorrallasComponent
      },
      {
        path: 'pagoMorralla/create',
        component: fromContainers.PagoDeMorrallaComponent
      },
      {
        path: 'pagoMorralla/:pagoId',
        canActivate: [fromGuards.PagoMorrallaExistsGuard],
        component: fromContainers.PagoDeMorrallaComponent
      },
      {
        path: 'cheques',
        canActivate: [fromGuards.ChequesGuard],
        children: [{ path: '', component: fromContainers.ChequesComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresosRoutingModule {}
