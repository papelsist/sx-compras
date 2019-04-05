import { NgModule } from '@angular/core';
import { SharedModule } from 'app/_shared/shared.module';

import { CobrosRoutingModule } from './cobros-routing.module';

import { StoreModule } from '@ngrx/store';
import * as fromCobro from './store/cobro.reducer';

import { EffectsModule } from '@ngrx/effects';
import { CobroEffects } from './store/cobro.effects';

import { containers } from './containers';
import { components, entryComponents } from './components';

@NgModule({
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  imports: [
    SharedModule,
    CobrosRoutingModule,
    StoreModule.forFeature('cobros', fromCobro.reducer),
    EffectsModule.forFeature([CobroEffects])
  ]
})
export class CobrosModule {}
