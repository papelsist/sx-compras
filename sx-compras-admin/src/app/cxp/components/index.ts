import { CfdisTableComponent } from './cfdis-table/cfdis-table.component';
import { CfdisTotalesPanelComponent } from './cfdis-totales-panel/cfdis-totales-panel.component';
import { AnalisisTableComponent } from './analisis-table/analisis-table.component';
import { AnalisisFormComponent } from './analisis-form/analisis-form.component';
import { FacturaSelectorComponent } from './factura-selector/factura-selector.component';
import { CxpFacturasTableComponent } from './cxp-facturas-table/cxp-facturas-table.component';
import { FacturaHeaderComponent } from './factura-header/factura-header.component';
import { ComsSelectorComponent } from './coms-selector/coms-selector.component';
import { ComsTableComponent } from './coms-table/coms-table.component';
import { AnalisisEditFormComponent } from './analisis-edit-form/analisis-edit-form.component';
import { AnalisisPartidasTableComponent } from './analisis-edit-form/analisis-partidas-table.component';
import { RequisicionesTableComponent } from './requisiciones-table/requisiciones-table.component';
import { RequisicionFormComponent } from './requisicion-form/requisicion-form.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisTotalesPanelComponent,
  AnalisisTableComponent,
  AnalisisFormComponent,
  AnalisisEditFormComponent,
  AnalisisPartidasTableComponent,
  FacturaSelectorComponent,
  CxpFacturasTableComponent,
  FacturaHeaderComponent,
  ComsSelectorComponent,
  ComsTableComponent,
  RequisicionesTableComponent,
  RequisicionFormComponent,
];

export const entryComponents = [
  FacturaSelectorComponent,
  ComsSelectorComponent
];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-totales-panel/cfdis-totales-panel.component';
export * from './analisis-table/analisis-table.component';
export * from './analisis-form/analisis-form.component';
export * from './analisis-edit-form/analisis-edit-form.component';
export * from './analisis-edit-form/analisis-partidas-table.component';
export * from './factura-selector/factura-selector.component';
export * from './cxp-facturas-table/cxp-facturas-table.component';
export * from './factura-header/factura-header.component';
export * from './coms-selector/coms-selector.component';
export * from './coms-table/coms-table.component';
export * from './requisiciones-table/requisiciones-table.component';
export * from './requisicion-form/requisicion-form.component';
