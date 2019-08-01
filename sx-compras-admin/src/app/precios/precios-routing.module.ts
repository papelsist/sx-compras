import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListasvGuard } from './guards/listasv.guard';
import { ListasComponent } from './pages/listas/listas.component';
import { ListavExistsGuard } from './guards/listav-exists.guard';
import { ListaComponent } from './pages/lista/lista.component';
import { ListaCreateComponent } from './pages/lista-create/lista-create.component';

import { ProductosGuard } from 'app/productos/guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [ListasvGuard, ProductosGuard],
    component: ListasComponent
  },
  {
    path: 'create',
    canActivate: [ListasvGuard, ProductosGuard],
    component: ListaCreateComponent
  },
  {
    path: 'edit/:listaId',
    canActivate: [ListasvGuard, ListavExistsGuard, ProductosGuard],
    component: ListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreciosRoutingModule {}
