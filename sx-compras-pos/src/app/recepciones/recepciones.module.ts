import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { RecepcionesRoutingModule } from './recepciones-routing.module';
import { AuthModule } from '../auth/auth.module';
import { ReportesModule } from '../reportes/reportes.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';
import { guards } from './guards';

import { components, entryComponents } from './components';
import { containers } from './containers';
import { services } from './services';

@NgModule({
  imports: [
    SharedModule,
    AuthModule,
    ReportesModule,
    RecepcionesRoutingModule,
    StoreModule.forFeature('recepciones', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services, ...guards]
})
export class RecepcionesModule {}
