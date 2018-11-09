import { TraspasosTableComponent } from './traspasos-table/traspasos-table.component';
import { TraspasoFormComponent } from './traspaso-form/traspaso-form-component';
import { TraspasoDetailComponent } from './traspaso-detail/traspaso-detail.component';
import { MovimientosCuentaTableComponent } from './movimientos-cuenta-table/movimientos-cuenta-table.component';
import { InversionFormComponent } from './inversion-form/inversion-form-component';
import { InversionesTableComponent } from './inversiones-table/inversiones-table.component';
import { InversionRetornoFormComponent } from './inversion-retorno-form/inversion-retorno-form-component';
import { MovTesFormComponent } from './mov-tes-form/mov-tes-form-component';
import { MovTesTableComponent } from './mov-tes-table/mov-tes-table.component';
import { ComisionesTableComponent } from './comisiones-table/comisiones-table.component';

export const components: any[] = [
  TraspasosTableComponent,
  TraspasoFormComponent,
  TraspasoDetailComponent,
  MovimientosCuentaTableComponent,
  InversionFormComponent,
  InversionesTableComponent,
  InversionRetornoFormComponent,
  MovTesFormComponent,
  MovTesTableComponent,
  ComisionesTableComponent
];
export const entryComponents: any[] = [
  TraspasoFormComponent,
  InversionFormComponent,
  InversionRetornoFormComponent,
  MovTesFormComponent
];

export * from './traspasos-table/traspasos-table.component';
export * from './traspaso-form/traspaso-form-component';
export * from './traspaso-detail/traspaso-detail.component';
export * from './movimientos-cuenta-table/movimientos-cuenta-table.component';
export * from './inversion-form/inversion-form-component';
export * from './inversiones-table/inversiones-table.component';
export * from './inversion-retorno-form/inversion-retorno-form-component';
export * from './mov-tes-form/mov-tes-form-component';
export * from './mov-tes-table/mov-tes-table.component';
export * from './comisiones-table/comisiones-table.component';
