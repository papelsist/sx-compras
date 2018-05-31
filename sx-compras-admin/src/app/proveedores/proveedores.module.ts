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
    SharedModule,
    ProveedoresRoutingModule,
    StoreModule.forFeature('proveedores', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers],
  exports: [...containers, ...components],
  providers: [...services]
})
export class ProveedoresModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ProveedoresModule,
      providers: [...services]
    };
  }
}
