import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { CxpRoutingModule } from './cxp-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

import { components, entryComponents } from './components';
import { containers } from './containers';
import { services } from './services';

@NgModule({
  imports: [
    SharedModule,
    CxpRoutingModule,
    StoreModule.forFeature('cxp', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services]
})
export class CxpModule {}
