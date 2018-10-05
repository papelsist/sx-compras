import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { RecepcionesRoutingModule } from './recepciones-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, FEATURE_NAME } from './store';
import { RecepcionesEffects } from './store/recepciones.effect';
import { guards } from './guards';

// Components
import { components, entryComponents } from './components';

// Containers
import { containers } from './containers';

// Services
import { services } from './services';
import { AuthModule } from '../auth/auth.module';
import { ReportesModule } from '../reportes/reportes.module';

@NgModule({
  imports: [
    SharedModule,
    AuthModule,
    ReportesModule,
    RecepcionesRoutingModule,
    StoreModule.forFeature(FEATURE_NAME, reducers),
    EffectsModule.forFeature([RecepcionesEffects])
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services, ...guards]
})
export class RecepcionesModule {}
