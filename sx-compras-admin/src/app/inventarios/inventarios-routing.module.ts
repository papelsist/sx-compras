import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventariosPageComponent } from './inventarios-page/inventarios-page.component';

const routes: Routes = [
  {
    path: '',
    component: InventariosPageComponent,
    children: [
      {
        path: 'ventas',
        loadChildren:
          'app/analisis-de-venta/analisis-de-venta.module#AnalisisDeVentaModule'
      },
      {
        path: 'existencias',
        loadChildren: 'app/existencias/existencias.module#ExistenciasModule'
      },
      {
        path: 'alcance-simple',
        loadChildren:
          'app/alcance-simple/alcance-simple.module#AlcanceSimpleModule'
      },
      {
        path: 'audit',
        loadChildren: 'app/audit/audit.module#AuditModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventariosRoutingModule {}
