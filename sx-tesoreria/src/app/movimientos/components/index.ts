import { TraspasosTableComponent } from './traspasos-table/traspasos-table.component';
import { TraspasoFormComponent } from './traspaso-form/traspaso-form-component';
import { TraspasoDetailComponent } from './traspaso-detail/traspaso-detail.component';
import { MovimientosCuentaTableComponent } from './movimientos-cuenta-table/movimientos-cuenta-table.component';
import { InversionFormComponent } from './inversion-form/inversion-form-component';
import { InversionesTableComponent } from './inversiones-table/inversiones-table.component';
import { InversionRetornoFormComponent } from './inversion-retorno-form/inversion-retorno-form-component';

export const components: any[] = [
  TraspasosTableComponent,
  TraspasoFormComponent,
  TraspasoDetailComponent,
  MovimientosCuentaTableComponent,
  InversionFormComponent,
  InversionesTableComponent,
  InversionRetornoFormComponent
];
export const entryComponents: any[] = [
  TraspasoFormComponent,
  InversionFormComponent,
  InversionRetornoFormComponent
];

export * from './traspasos-table/traspasos-table.component';
export * from './traspaso-form/traspaso-form-component';
export * from './traspaso-detail/traspaso-detail.component';
export * from './movimientos-cuenta-table/movimientos-cuenta-table.component';
export * from './inversion-form/inversion-form-component';
export * from './inversiones-table/inversiones-table.component';
export * from './inversion-retorno-form/inversion-retorno-form-component';
