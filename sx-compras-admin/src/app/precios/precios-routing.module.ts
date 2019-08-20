import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListasvGuard } from './guards/listasv.guard';
import { ListasComponent } from './pages/listas/listas.component';
import { ListavExistsGuard } from './guards/listav-exists.guard';
import { ListaComponent } from './pages/lista/lista.component';
import { ListaCreateComponent } from './pages/lista-create/lista-create.component';

import { ProductosGuard } from 'app/productos/guards';
import { DisponiblesGuard } from './guards/disponibles.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ListasvGuard],
    component: ListasComponent
  },
  {
    path: 'create',
    canActivate: [ListasvGuard, DisponiblesGuard],
    component: ListaCreateComponent
  },
  {
    path: ':listaId',
    canActivate: [ListasvGuard, ListavExistsGuard, DisponiblesGuard],
    component: ListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreciosRoutingModule {}
