import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditoPageComponent } from './credito-page/credito-page.component';
import { BonificacionesComponent } from 'app/cobranza/ncredito/pages';

const routes: Routes = [
  {
    path: '',
    component: CreditoPageComponent,
    children: [{ path: 'bonificaciones', component: BonificacionesComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditoRoutingModule {}
