import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './_core/containers/main-page/main-page.component';
import { HomePageComponent } from './_core/containers/home-page/home-page.component';
import { AuthGuard } from './auth/services/auth.guard';
import { AuthRoleGuard } from './auth/services/auth_role.guard';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePageComponent },
      {
        path: 'catalogos',
        canActivate: [AuthRoleGuard],
        loadChildren: './productos/productos.module#ProductosModule'
      },
      {
        path: 'cxp',
        canActivate: [AuthRoleGuard],
        loadChildren: './cxp/cxp.module#CxpModule'
      },
      {
        path: 'proveedores',
        canActivate: [AuthRoleGuard],
        loadChildren: './proveedores/proveedores.module#ProveedoresModule'
      },
      {
        path: 'ordenes',
        canActivate: [AuthRoleGuard],
        loadChildren: './ordenes/ordenes.module#OrdenesModule'
      },
      {
        path: 'inventarios',
        loadChildren: './inventarios/inventarios.module#InventariosModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
