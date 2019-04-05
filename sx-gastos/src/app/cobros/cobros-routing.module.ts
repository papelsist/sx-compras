import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import * as containers from './containers';
import { CobrosGuard } from './guards/cobros.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [CobrosGuard],
    component: containers.CobrosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobrosRoutingModule {}
