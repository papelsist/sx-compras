import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CambiosComponent } from './pages/cambios/cambios.component';
import { CambiosGuard, CambioExistsGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [CambiosGuard],
    component: CambiosComponent
  },
  {
    path: '/:cambioId',
    canActivate: [CambiosGuard, CambioExistsGuard],
    component: CambiosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreciosRoutingModule {}
