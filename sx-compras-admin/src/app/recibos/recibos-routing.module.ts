import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecibosPageComponent } from './recibos-page/recibos-page.component';
import { RecibosGuard } from './guards/recibos.guard';
import { ReciboExistsGuard } from './guards/recibo-exists.guard';
import { ReciboPageComponent } from './recibo-page/recibo-page.component';

const routes: Routes = [
  { path: '', canActivate: [RecibosGuard], component: RecibosPageComponent },
  {
    path: ':reciboId',
    canActivate: [ReciboExistsGuard],
    component: ReciboPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecibosRoutingModule {}
