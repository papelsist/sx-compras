import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { RequisicionDeMaterialEffects } from './store/effects';

import { RequisicionesRoutingModule } from './requisiciones-routing.module';
import { RequisicionesComponent } from './pages/requisiciones/requisiciones.component';
import { RequisicionesTableComponent } from './components/requisiciones-table/requisiciones-table.component';
import { RequisicionCreateComponent } from './components/requisicion-create/requisicion-create.component';

@NgModule({
  declarations: [
    RequisicionesComponent,
    RequisicionesTableComponent,
    RequisicionCreateComponent
  ],
  entryComponents: [RequisicionCreateComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([RequisicionDeMaterialEffects]),
    RequisicionesRoutingModule
  ]
})
export class RequisicionesModule {}
