import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { OrdenesRoutingModule } from './ordenes-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';
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
    OrdenesRoutingModule,
    StoreModule.forFeature('ordenes', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services, ...guards]
})
export class OrdenesModule {}
