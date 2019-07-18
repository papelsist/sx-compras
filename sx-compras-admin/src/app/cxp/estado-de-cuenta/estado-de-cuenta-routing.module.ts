import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcuentaPageComponent } from './ecuenta-page/ecuenta-page.component';

const routes: Routes = [{ path: '', component: EcuentaPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoDeCuentaRoutingModule {}
