import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { ExistenciasEffects } from './store/effects';

import { ExistenciasRoutingModule } from './existencias-routing.module';
import { ExistenciasComponent } from './pages/existencias/existencias.component';
import { ExistenciasTableComponent } from './components/existencias-table/existencias-table.component';

@NgModule({
  declarations: [ExistenciasComponent, ExistenciasTableComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([ExistenciasEffects]),
    ExistenciasRoutingModule
  ]
})
export class ExistenciasModule {}
