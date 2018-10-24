import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';
import { AnalisisDeVentasRoutingModule } from './analisis-de-ventas-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';

import { services } from './services';
import { containers } from './containers';
import { components, entryComponents } from './components';
import { reportes } from './reportes';
import { ReportesModule } from 'app/reportes/reportes.module';

@NgModule({
  imports: [
    SharedModule,
    AnalisisDeVentasRoutingModule,
    ReportesModule,
    StoreModule.forFeature('analisis-de-venta', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers, ...reportes],
  entryComponents: [...entryComponents, ...reportes],
  providers: [...services]
})
export class AnalisisDeVentasModule {}
