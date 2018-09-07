import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlcancesComponent } from './containers/alcances.component';

const routes: Routes = [
  {
    path: '',
    component: AlcancesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlcancesRoutingModule {}
