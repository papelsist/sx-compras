import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { RecibosEffects } from './store/effects';

import { RecibosRoutingModule } from './recibos-routing.module';
import { SharedModule } from 'app/_shared/shared.module';
import { RecibosPageComponent } from './recibos-page/recibos-page.component';
import { RecibosTableComponent } from './recibos-table/recibos-table.component';
import { ReciboPageComponent } from './recibo-page/recibo-page.component';
import { RecibosdetTableComponent } from './recibosdet-table/recibosdet-table.component';
import { ReqdetTableComponent } from './reqdet-table/reqdet-table.component';
import { SelectorRequisicionesComponent } from './selector-requisiciones/selector-requisiciones.component';
import { RequisicionesSelectorTableComponent } from './selector-requisiciones/requisiciones-selector-table.component';

@NgModule({
  declarations: [
    RecibosPageComponent,
    RecibosTableComponent,
    ReciboPageComponent,
    RecibosdetTableComponent,
    ReqdetTableComponent,
    SelectorRequisicionesComponent,
    RequisicionesSelectorTableComponent
  ],
  entryComponents: [SelectorRequisicionesComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([RecibosEffects]),
    RecibosRoutingModule
  ]
})
export class RecibosModule {}
