import { NgModule } from '@angular/core';

import { CortesTarjetaRoutingModule } from './cortes-tarjeta-routing.module';
import { components, entryComponents } from './components';
import { containers } from './containers';
import { services } from './services';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [SharedModule, CortesTarjetaRoutingModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services]
})
export class CortesTarjetaModule {}
