import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditoPageComponent } from './credito-page/credito-page.component';
import { resolveCartera } from 'app/cobranza/models';
import { CarteraGuard } from 'app/cobranza/guards/cartera.guard';

const routes: Routes = [
  {
    path: '',
    component: CreditoPageComponent,
    data: { cartera: resolveCartera('CRE') },
    canActivate: [CarteraGuard],
    children: [
      { path: 'notas', loadChildren: 'app/notas/notas.module#NotasModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditoRoutingModule {}
