import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { ListaDePreciosEffects } from './store/effects';

import { PreciosRoutingModule } from './precios-routing.module';
import { ListasComponent } from './pages/listas/listas.component';
import { ListaComponent } from './pages/lista/lista.component';
import { ListasGridComponent } from './components/listas-grid/listas-grid.component';
import { ListaCreateComponent } from './pages/lista-create/lista-create.component';
import { ListaFormComponent } from './components/lista-form/lista-form.component';

@NgModule({
  declarations: [ListasComponent, ListaComponent, ListasGridComponent, ListaCreateComponent, ListaFormComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([ListaDePreciosEffects]),
    PreciosRoutingModule
  ]
})
export class PreciosModule {}
