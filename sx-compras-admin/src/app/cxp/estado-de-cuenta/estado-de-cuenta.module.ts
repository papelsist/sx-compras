import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './store/estado-de-cuenta.reducer';

import { SharedModule } from 'app/_shared/shared.module';

import { EstadoDeCuentaRoutingModule } from './estado-de-cuenta-routing.module';
import { EcuentaPageComponent } from './ecuenta-page/ecuenta-page.component';
import { EcuentaTableComponent } from './ecuenta-table/ecuenta-table.component';

@NgModule({
  declarations: [EcuentaPageComponent, EcuentaTableComponent],
  imports: [
    SharedModule,
    EstadoDeCuentaRoutingModule,
    StoreModule.forFeature('estado-de-cuenta', reducer),
    EffectsModule.forFeature([])
  ]
})
export class EstadoDeCuentaModule {}
