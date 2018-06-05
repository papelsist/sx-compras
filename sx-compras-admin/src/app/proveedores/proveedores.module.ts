import {
  NgModule,
  ModuleWithProviders,
  ModuleWithComponentFactories
} from '@angular/core';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { SharedModule } from '../_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

import { services } from './services';
import { components } from './components';
import { containers } from './containers';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [...components, ...containers],
  exports: [...containers, ...components],
})
export class ProveedoresModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootProveedoresModule,
      providers: [...services]
    };
  }
}

@NgModule({
  imports: [
    ProveedoresRoutingModule,
    StoreModule.forFeature('proveedores', reducers),
    EffectsModule.forFeature(effects)
  ]
})
export class RootProveedoresModule {}
