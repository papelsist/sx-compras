import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditoPageComponent } from './credito-page/credito-page.component';
import { BonificacionesComponent } from 'app/notas/pages';
import { BonificacionesGuard } from 'app/notas/guards/bonificaciones.guard';
import { resolveCartera } from 'app/cobranza/models';
import { CarteraGuard } from 'app/cobranza/guards/cartera.guard';

const routes: Routes = [
  {
    path: '',
    component: CreditoPageComponent,
    data: { cartera: resolveCartera('CRE') },
    canActivate: [CarteraGuard],
    children: [
      {
        path: 'bonificaciones',
        canActivate: [BonificacionesGuard],
        component: BonificacionesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditoRoutingModule {}
