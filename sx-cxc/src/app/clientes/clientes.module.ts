import { NgModule, ModuleWithProviders } from '@angular/core';

import { ClientesRoutingModule } from './clientes-routing.module';
import { SharedModule } from '../_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

import { services } from './services';
import { guards } from './guards';
import { components, entryComponents } from './components';
import { containers } from './containers';
import { AuthModule } from '../auth/auth.module';
import { ReportesModule } from '../reportes/reportes.module';

@NgModule({
  imports: [SharedModule, ClientesRoutingModule, AuthModule, ReportesModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  exports: [...containers, ...components]
})
export class ClientesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootClientesModule,
      providers: [...services, ...guards]
    };
  }
}

@NgModule({
  imports: [
    ClientesModule,
    StoreModule.forFeature('clientes', reducers),
    EffectsModule.forFeature(effects)
  ]
})
export class RootClientesModule {}
