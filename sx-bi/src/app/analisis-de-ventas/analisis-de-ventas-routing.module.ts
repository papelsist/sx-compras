import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AnalisisDeVentaPageComponent,
  VentasNetasComponent,
  VentaPorProductoComponent
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: AnalisisDeVentaPageComponent,
    children: [
      { path: '', component: VentasNetasComponent },
      { path: ':id', component: VentaPorProductoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalisisDeVentasRoutingModule {}
