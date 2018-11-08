import { TraspasosTableComponent } from './traspasos-table/traspasos-table.component';
import { TraspasoFormComponent } from './traspaso-form/traspaso-form-component';
import { TraspasoDetailComponent } from './traspaso-detail/traspaso-detail.component';
import { MovimientosCuentaTableComponent } from './movimientos-cuenta-table/movimientos-cuenta-table.component';
import { InversionFormComponent } from './inversion-form/inversion-form-component';

export const components: any[] = [
  TraspasosTableComponent,
  TraspasoFormComponent,
  TraspasoDetailComponent,
  MovimientosCuentaTableComponent,
  InversionFormComponent
];
export const entryComponents: any[] = [
  TraspasoFormComponent,
  InversionFormComponent
];

export * from './traspasos-table/traspasos-table.component';
export * from './traspaso-form/traspaso-form-component';
export * from './traspaso-detail/traspaso-detail.component';
export * from './movimientos-cuenta-table/movimientos-cuenta-table.component';
export * from './inversion-form/inversion-form-component';
