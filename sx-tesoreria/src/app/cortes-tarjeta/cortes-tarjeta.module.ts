import { NgModule } from '@angular/core';

import { CortesTarjetaRoutingModule } from './cortes-tarjeta-routing.module';
import { components, entryComponents } from './components';
import { containers } from './containers';
import { services } from './services';
import { SharedModule } from '../_shared/shared.module';
import { ReportesModule } from 'app/reportes/reportes.module';

@NgModule({
  imports: [SharedModule, CortesTarjetaRoutingModule, ReportesModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services]
})
export class CortesTarjetaModule {}
