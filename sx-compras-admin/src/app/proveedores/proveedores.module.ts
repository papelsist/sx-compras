import { NgModule, ModuleWithProviders } from '@angular/core';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { SharedModule } from '../_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

import { services } from './services';
import { guards } from './guards';
import { components, entryComponents } from './components';
import { containers } from './containers';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  imports: [SharedModule, ProveedoresRoutingModule, AuthModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  exports: [...containers, ...components]
})
export class ProveedoresModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootProveedoresModule,
      providers: [...services, ...guards]
    };
  }
}

@NgModule({
  imports: [
    ProveedoresModule,
    StoreModule.forFeature('proveedores', reducers),
    EffectsModule.forFeature(effects)
  ]
})
export class RootProveedoresModule {}
