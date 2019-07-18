import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/estado-de-cuenta.reducer';
import { EstadoDeCuentaEffects } from './store/estado-de-cuenta.effects';

import { SharedModule } from 'app/_shared/shared.module';

import { EstadoDeCuentaRoutingModule } from './estado-de-cuenta-routing.module';
import { EcuentaPageComponent } from './ecuenta-page/ecuenta-page.component';
import { EcuentaTableComponent } from './ecuenta-table/ecuenta-table.component';
import { EcuentaFacsPageComponent } from './ecuenta-facs-page/ecuenta-facs-page.component';
import { EcuentaFacsTableComponent } from './ecuenta-facs-table/ecuenta-facs-table.component';

@NgModule({
  declarations: [EcuentaPageComponent, EcuentaTableComponent, EcuentaFacsPageComponent, EcuentaFacsTableComponent],
  imports: [
    SharedModule,
    EstadoDeCuentaRoutingModule,
    StoreModule.forFeature('estado-de-cuenta', reducer),
    EffectsModule.forFeature([EstadoDeCuentaEffects])
  ]
})
export class EstadoDeCuentaModule {}
