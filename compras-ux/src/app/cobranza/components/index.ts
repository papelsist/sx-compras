import { CobrosTableComponent } from './cobros-table/cobros-table.component';

import { CarteraFilterBtnComponent } from './cartera-filter/cartera-filter-btn.component';
import { CarteraFilterLabelComponent } from './cartera-filter/cartera-filter-label.component';
import { CarteraFilterComponent } from './cartera-filter/cartera-filter.component';
import { SolicitudesTableComponent } from './solicitudes-table/solicitudes-table.component';
import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';
import { CobroHeaderComponent } from './cobro-header/cobro-header.component';
import { AplicacionesTableComponent } from './aplicaciones-table/aplicaciones-table.component';
import { CxCSelectorComponent } from './cxc-selector/cxc-selector.component';
import { CxCSelectorDialogComponent } from './cxc-selector/cxc-selector-dialog.component';
import { CxCTableComponent } from './cxc-table/cxc-table.component';
import { NotasDeCargoTableComponent } from './notas-de-cargo-table/notas-de-cargo-table.component';
import { NotaDeCargoFormComponent } from './nota-de-cargo-form/nota-de-cargo-form.component';
import { NcHeaderComponent } from './nota-de-cargo-form/nc-header/nc-header.component';
import { NcPartidasComponent } from './nota-de-cargo-form/nc-partidas/nc-partidas.component';

export const components: any[] = [
  CarteraFilterBtnComponent,
  CarteraFilterLabelComponent,
  CarteraFilterComponent,
  CobrosTableComponent,
  CobroHeaderComponent,
  AplicacionesTableComponent,
  CxCSelectorComponent,
  CxCSelectorDialogComponent,
  CxCTableComponent,

  // Solicitudes
  SolicitudesTableComponent,
  SolicitudFormComponent,

  // Notas de Cargo
  NotasDeCargoTableComponent,
  NotaDeCargoFormComponent,
  NcHeaderComponent,
  NcPartidasComponent
];

export const entryComponents: any[] = [
  CarteraFilterComponent,
  SolicitudFormComponent,
  CxCSelectorDialogComponent
];

export * from './cartera-filter/cartera-filter-btn.component';
export * from './cartera-filter/cartera-filter-label.component';
export * from './cartera-filter/cartera-filter.component';

export * from './cobros-table/cobros-table.component';
export * from './cobro-header/cobro-header.component';
export * from './aplicaciones-table/aplicaciones-table.component';
export * from './cxc-selector/cxc-selector.component';
export * from './cxc-selector/cxc-selector-dialog.component';
export * from './cxc-table/cxc-table.component';

export * from './solicitudes-table/solicitudes-table.component';
export * from './solicitud-form/solicitud-form.component';

// Notas de cargo
export * from './notas-de-cargo-table/notas-de-cargo-table.component';
export * from './nota-de-cargo-form/nota-de-cargo-form.component';
export * from './nota-de-cargo-form/nc-header/nc-header.component';
export * from './nota-de-cargo-form/nc-partidas/nc-partidas.component';
