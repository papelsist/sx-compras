import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { CambiosDePrecioEffects } from './store/effects';

import { PreciosRoutingModule } from './precios-routing.module';
import { CambiosComponent } from './pages/cambios/cambios.component';
import { CambioComponent } from './pages/cambio/cambio.component';

@NgModule({
  declarations: [CambiosComponent, CambioComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([CambiosDePrecioEffects]),
    PreciosRoutingModule
  ]
})
export class PreciosModule {}
