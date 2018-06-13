import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';

const routes: Routes = [
  {
    path: '',
    component: fromContainers.CxpPageComponent,
    children: [
      { path: 'cfdis', component: fromContainers.CfdisComponent, children: [] },
      { path: 'analisis', component: fromContainers.AnalisisComponent },
      {
        path: 'analisis/create',
        component: fromContainers.AnalisisDeFacturaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CxpRoutingModule {}
