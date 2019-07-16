import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import {
  ProveedoresGuard,
  ProveedorExistsGuard,
  ProveedorProductosGuard,
  ProveedorListasGuard,
  ProveedorListaExistsGuard
} from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.ProveedoresPageComponent,
    canActivate: [ProveedoresGuard],
    children: [{ path: '', component: fromContainers.ProveedoresComponent }]
  },
  {
    path: 'create',
    component: fromContainers.ProveedorCreateComponent
  },
  {
    path: ':proveedorId',
    canActivate: [ProveedoresGuard, ProveedorExistsGuard],
    component: fromContainers.ProveedorPageComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      {
        path: 'info',
        component: fromContainers.ProveedorComponent
      },
      {
        path: 'productos',
        canActivate: [ProveedorProductosGuard],
        component: fromContainers.ProveedoProductosComponent
      },
      {
        path: 'listas',
        canActivate: [ProveedorListasGuard],
        component: fromContainers.ProveedorListasComponent
      },
      {
        path: 'listas/create',
        canActivate: [ProveedorProductosGuard],
        component: fromContainers.ProveedorListaCreateComponent
      },
      {
        path: 'listas/:id',
        canActivate: [
          ProveedorListasGuard,
          ProveedorProductosGuard,
          ProveedorListaExistsGuard
        ],
        component: fromContainers.ProveedorListaEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule {}
