import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { RequisicionDeMaterialEffects } from './store/effects';

import { RequisicionesMaterialRoutingModule } from './requisiciones-material-routing.module';
//
import { RequisicionesComponent } from './pages/requisiciones/requisiciones.component';
import { RequisicionComponent } from './pages/requisicion/requisicion.component';
// Dumb components
import { RequisicionesTableComponent } from './components/requisiciones-table/requisiciones-table.component';
import { RequisicionCreateComponent } from './components/requisicion-create/requisicion-create.component';
import { RequisicionPartidasComponent } from './components/requisicion-partidas/requisicion-partidas.component';

@NgModule({
  declarations: [
    RequisicionesComponent,
    RequisicionesTableComponent,
    RequisicionCreateComponent,
    RequisicionComponent,
    RequisicionPartidasComponent
  ],
  entryComponents: [RequisicionCreateComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([RequisicionDeMaterialEffects]),
    RequisicionesMaterialRoutingModule
  ]
})
export class RequisicionesMaterialModule {}
