import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { AlcancesRoutingModule } from './alcances-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AuthModule } from '../auth/auth.module';
import { ReportesModule } from '../reportes/reportes.module';
import { AlcancesService } from './services/alcances.service';
import { AlcancesComponent } from './containers/alcances.component';
import { components, entryComponents } from './components';

@NgModule({
  imports: [
    SharedModule,
    AuthModule,
    ReportesModule,
    AlcancesRoutingModule,
    StoreModule.forFeature('alcances', {}),
    EffectsModule.forFeature([])
  ],
  declarations: [AlcancesComponent, ...components],
  entryComponents: [...entryComponents],
  providers: [AlcancesService]
})
export class AlcancesModule {}
