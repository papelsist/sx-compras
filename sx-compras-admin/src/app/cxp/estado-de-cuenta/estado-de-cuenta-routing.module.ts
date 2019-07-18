import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcuentaPageComponent } from './ecuenta-page/ecuenta-page.component';
import { EcuentaFacsPageComponent } from './ecuenta-facs-page/ecuenta-facs-page.component';

const routes: Routes = [
  { path: 'movs', component: EcuentaPageComponent },
  { path: 'facs', component: EcuentaFacsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoDeCuentaRoutingModule {}
