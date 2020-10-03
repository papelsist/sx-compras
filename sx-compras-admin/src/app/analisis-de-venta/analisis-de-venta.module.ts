import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { SharedModule } from 'app/_shared/shared.module';
import { AnalisisDeVentaComponent } from './analisis-de-venta-page.component';
import { VentasGridComponent } from './ventas-grid/ventas-grid.component';

const routes: Route[] = [
  {
    path: '',
    component: AnalisisDeVentaComponent
  }
];

@NgModule({
  declarations: [AnalisisDeVentaComponent, VentasGridComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AnalisisDeVentaModule {}
