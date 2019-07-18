import { NgModule } from '@angular/core';
import { SharedModule } from 'app/_shared/shared.module';

import { CobranzaRoutingModule } from './cobranza-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

import { containers } from './containers';
import { components, entryComponents } from './components';

@NgModule({
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  imports: [
    SharedModule,
    CobranzaRoutingModule,
    StoreModule.forFeature('cobranza', reducers),
    EffectsModule.forFeature(effects)
  ],
  exports: [...components, ...entryComponents]
})
export class CobranzaModule {}
