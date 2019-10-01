import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.CxpPageComponent,
    children: [
      { path: 'cfdis', component: fromContainers.CfdisComponent, children: [] },
      {
        path: 'facturas',
        canActivate: [fromGuards.FacturasGuard],
        component: fromContainers.FacturasComponent
      },
      {
        path: 'analisis',
        canActivate: [fromGuards.AnalisisGuard],
        children: [
          { path: '', component: fromContainers.AnalisisComponent },
          {
            path: 'create',
            component: fromContainers.AnalisisDeFacturaComponent
          },
          {
            path: ':analisisId',
            canActivate: [fromGuards.AnalisisExistsGuard],
            component: fromContainers.AnalisisEditComponent
          }
        ]
      },
      {
        path: 'requisiciones',
        children: [
          {
            path: '',
            canActivate: [fromGuards.RequisicionesGuard],
            component: fromContainers.RequisicionesComponent
          },
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
      },
      {
        path: 'analisisDeNotas',
        canActivate: [fromGuards.NotasGuard],
        children: [
          { path: '', component: fromContainers.AnalisisDeNotasComponent },
          {
            path: ':notaId',
            canActivate: [fromGuards.NotaExistsGuard],
            component: fromContainers.AnalisisDeNotaComponent
          }
        ]
      },
      {
        path: 'analisisDeTrs',
        canActivate: [fromGuards.AnalisisTrsGuard],
        children: [
          {
            path: '',
            component: fromContainers.AnalisisDeTransformacionesComponent
          },
          {
            path: ':analisisId',
            component: fromContainers.AnalisisDeTransformacionComponent
          }
        ]
      },
      {
        path: 'contrarecibos',
        canActivate: [fromGuards.ContrarecibosGuard],
        children: [
          { path: '', component: fromContainers.RecibosComponent },
          { path: 'create', component: fromContainers.ReciboComponent },
          {
            path: ':reciboId',
            canActivate: [fromGuards.ContrareciboExistsGuard],
            component: fromContainers.ReciboComponent
          }
        ]
      },
      {
        path: 'cartera',
        loadChildren: './cartera/cartera.module#CarteraModule'
      },
      {
        path: 'ecuenta',
        loadChildren:
          './estado-de-cuenta/estado-de-cuenta.module#EstadoDeCuentaModule'
      },
      {
        path: 'recibos',
        loadChildren: 'app/recibos/recibos.module#RecibosModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CxpRoutingModule {}
