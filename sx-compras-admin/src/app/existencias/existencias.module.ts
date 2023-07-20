import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, FEATURE_STORE_NAME } from './store/reducer';
import { ExistenciasEffects } from './store/effects';

import { ExistenciasRoutingModule } from './existencias-routing.module';
import { ExistenciasComponent } from './pages/existencias/existencias.component';
import { ExistenciasTableComponent } from './components/existencias-table/existencias-table.component';
// tslint:disable-next-line:max-line-length
import { ExistenciaSemanaReportDialogComponent } from './pages/existencias/components/existencia-semana-report-dialog/existencia-semana-report-dialog.component';

@NgModule({
  declarations: [ExistenciasComponent, ExistenciasTableComponent,ExistenciaSemanaReportDialogComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(FEATURE_STORE_NAME, reducer),
    EffectsModule.forFeature([ExistenciasEffects]),
    ExistenciasRoutingModule
  ],
  entryComponents: [ExistenciaSemanaReportDialogComponent],
})
export class ExistenciasModule {}
