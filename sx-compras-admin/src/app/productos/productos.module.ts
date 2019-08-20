import { NgModule, ModuleWithProviders } from '@angular/core';

import { ProductosRoutingModule } from './productos-routing.module';
import { SharedModule } from '../_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

// components
import { components, entryComponents } from './components';
// containers
import { containers } from './containers';
// services
import { services } from './services';

// gards
import { guards } from './guards';

@NgModule({
  imports: [SharedModule, ProductosRoutingModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents]
})
export class ProductosModule {
  static forRoot(): ModuleWithProviders {
    return {
      // tslint:disable-next-line: no-use-before-declare
      ngModule: RootProductosModule,
      providers: [...services, ...guards]
    };
  }
}
@NgModule({
  imports: [
    ProductosModule,
    StoreModule.forFeature('catalogos', reducers),
    EffectsModule.forFeature(effects)
  ]
})
export class RootProductosModule {}
