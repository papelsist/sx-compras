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
import { ReportesModule } from '../reportes/reportes.module';
import { ProductosSelectorModule } from './productos-selector/productos-selector.module';

@NgModule({
  imports: [
    SharedModule,
    ProveedoresRoutingModule,
    AuthModule,
    ReportesModule,
    ProductosSelectorModule
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  exports: [...containers, ...components]
})
export class ProveedoresModule {
  static forRoot(): ModuleWithProviders {
    return {
      // tslint:disable-next-line: no-use-before-declare
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
