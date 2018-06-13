import { CfdisTableComponent } from './cfdis-table/cfdis-table.component';
import { CfdisTotalesPanelComponent } from './cfdis-totales-panel/cfdis-totales-panel.component';
import { AnalisisTableComponent } from './analisis-table/analisis-table.component';
import { AnalisisFormComponent } from './analisis-form/analisis-form.component';
import { FacturaSelectorComponent } from './factura-selector/factura-selector.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisTotalesPanelComponent,
  AnalisisTableComponent,
  AnalisisFormComponent,
  FacturaSelectorComponent
];

export const entryComponents = [FacturaSelectorComponent];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-totales-panel/cfdis-totales-panel.component';
export * from './analisis-table/analisis-table.component';
export * from './analisis-form/analisis-form.component';
export * from './factura-selector/factura-selector.component';
