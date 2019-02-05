import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { ReportesModule } from '../reportes/reportes.module';
import { CuentasRoutingModule } from './cuentas-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AgGridModule } from 'ag-grid-angular';

import { reducers, effects } from './store';

import { components, entryComponents } from './components';
import { containers } from './containers';
import { services } from './services';
import { guards } from './guards';

@NgModule({
  imports: [
    SharedModule,
    CuentasRoutingModule,
    ReportesModule,
    AgGridModule.withComponents([]),
    StoreModule.forFeature('cuentas', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services, ...guards]
})
export class CuentasModule {}
