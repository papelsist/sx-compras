import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';
import * as fromGuards from './guards';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.CxpPageComponent,
    children: [
      { path: 'cfdis', component: fromContainers.CfdisComponent, children: [] },
      {
        path: 'analisis',
        canActivate: [fromGuards.AnalisisGuard],
        children: [
          { path: '', component: fromContainers.AnalisisComponent },
          {
            path: 'create',
            component: fromContainers.AnalisisDeFacturaComponent
          },
          {
            path: ':analisisId',
            canActivate: [fromGuards.AnalisisExistsGuard],
            component: fromContainers.AnalisisEditComponent
          }
        ]
      },
      {
        path: 'requisiciones',
        children: [
          { path: '', component: fromContainers.RequisicionesComponent },
          { path: 'create', component: fromContainers.RequisicionComponent },
          {
            path: ':requisicionId',
            canActivate: [fromGuards.RequisicionExistsGuard],
            component: fromContainers.RequisicionComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CxpRoutingModule {}
