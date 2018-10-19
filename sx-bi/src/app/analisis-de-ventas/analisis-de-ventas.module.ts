import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';
import { AnalisisDeVentasRoutingModule } from './analisis-de-ventas-routing.module';

import { services } from './services';
import { containers } from './containers';
import { components, entryComponents } from './components';

@NgModule({
  imports: [SharedModule, AnalisisDeVentasRoutingModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services]
})
export class AnalisisDeVentasModule {}
