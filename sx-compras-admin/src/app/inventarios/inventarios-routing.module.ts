import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventariosPageComponent } from './inventarios-page/inventarios-page.component';

const routes: Routes = [
  {
    path: '',
    component: InventariosPageComponent,
    children: [
      {
        path: 'existencias',
        loadChildren: 'app/existencias/existencias.module#ExistenciasModule'
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
