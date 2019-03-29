import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './_core/containers/main-page/main-page.component';
import { HomePageComponent } from './_core/containers/home-page/home-page.component';
import { AuthGuard } from './auth/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePageComponent },
      {
        path: 'catalogos',
        loadChildren: './productos/productos.module#ProductosModule'
      },
      {
        path: 'cxp',
        loadChildren: './cxp/cxp.module#CxpModule'
      },
      {
        path: 'proveedores',
        loadChildren: './proveedores/proveedores.module#ProveedoresModule'
      },
      {
        path: 'embarques',
        loadChildren:
          './control-de-embarques/control-de-embarques.module#ControlDeEmbarquesModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
