import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import { ProveedoresGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.ProveedoresPageComponent,
    canActivate: [ProveedoresGuard],
    children: [{ path: '', component: fromContainers.ProveedoresComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule {}
