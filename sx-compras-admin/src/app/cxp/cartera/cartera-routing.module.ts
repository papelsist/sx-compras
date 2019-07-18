import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarteraPageComponent } from './cartera-page/cartera-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'all' },
  { path: 'all', component: CarteraPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteraRoutingModule {}
