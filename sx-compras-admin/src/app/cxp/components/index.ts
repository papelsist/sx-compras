import { CfdisTableComponent } from './cfdis-table/cfdis-table.component';
import { CfdisTotalesPanelComponent } from './cfdis-totales-panel/cfdis-totales-panel.component';
import { AnalisisTableComponent } from './analisis-table/analisis-table.component';
import { AnalisisFormComponent } from './analisis-form/analisis-form.component';
import { FacturaSelectorComponent } from './factura-selector/factura-selector.component';
import { CxpFacturasTableComponent } from './cxp-facturas-table/cxp-facturas-table.component';
import { FacturaHeaderComponent } from './factura-header/factura-header.component';
import { ComsSelectorComponent } from './coms-selector/coms-selector.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisTotalesPanelComponent,
  AnalisisTableComponent,
  AnalisisFormComponent,
  FacturaSelectorComponent,
  CxpFacturasTableComponent,
  FacturaHeaderComponent,
  ComsSelectorComponent
];

export const entryComponents = [
  FacturaSelectorComponent,
  ComsSelectorComponent
];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-totales-panel/cfdis-totales-panel.component';
export * from './analisis-table/analisis-table.component';
export * from './analisis-form/analisis-form.component';
export * from './factura-selector/factura-selector.component';
export * from './cxp-facturas-table/cxp-facturas-table.component';
export * from './factura-header/factura-header.component';
export * from './coms-selector/coms-selector.component';
