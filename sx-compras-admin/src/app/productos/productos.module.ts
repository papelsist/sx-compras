import { NgModule } from '@angular/core';

import { ProductosRoutingModule } from './productos-routing.module';
import { SharedModule } from '../_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

// components
import { components } from './components';
// containers
import { containers } from './containers';
// services
import { services } from './services';

// gards
import { guards } from './guards';

@NgModule({
  imports: [
    SharedModule,
    ProductosRoutingModule,
    StoreModule.forFeature('catalogos', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers],
  providers: [...services, ...guards]
})
export class ProductosModule {}
