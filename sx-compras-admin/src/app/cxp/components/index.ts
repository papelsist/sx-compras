import { CfdisTableComponent } from './cfdis-table/cfdis-table.component';
import { CfdisTotalesPanelComponent } from './cfdis-totales-panel/cfdis-totales-panel.component';
import { AnalisisTableComponent } from './analisis-table/analisis-table.component';
import { AnalisisFormComponent } from './analisis-form/analisis-form.component';
import { FacturaSelectorComponent } from './factura-selector/factura-selector.component';
import { FacturasSelectorBtnComponent } from './factura-selector/factura-selector-btn.component';
import { CxpFacturasTableComponent } from './cxp-facturas-table/cxp-facturas-table.component';
import { FacturaHeaderComponent } from './factura-header/factura-header.component';
import { ComsSelectorComponent } from './coms-selector/coms-selector.component';
import { ComsTableComponent } from './coms-table/coms-table.component';
import { AnalisisEditFormComponent } from './analisis-edit-form/analisis-edit-form.component';
import { AnalisisPartidasTableComponent } from './analisis-edit-form/analisis-partidas-table.component';
// Requisiciones
import { RequisicionesTableComponent } from './requisiciones-table/requisiciones-table.component';
import { RequisicionFormComponent } from './requisicion-form/requisicion-form.component';
import { RequisicionPartidasComponent } from './requisicion-partidas/requisicion-partidas.component';
import { AgregarFacturasComponent } from './requisicion-form/agregar-facturas.component';
import { PrintAnalisisComponent } from './print-analisis/print-analisis.component';
import { PrintRequisicionComponent } from './print-requisicion/print-requisicion.component';
// Notas
import { NotasTableComponent } from './notas-table/notas-table.component';
import { ReportComsSinAnalizarComponent } from './report-coms-sin-analizar/report-coms-sin-analizar.component';
import { NotaFormComponent } from './nota-form/nota-form.component';
import { NotaConceptosComponent } from './nota-conceptos/nota-conceptos.component';
import { FacturasTableComponent } from './facturas-table/facturas-table.component';
import { SelectorCxPComponent } from './selector-cxp/selector-cxp.component';
import { RecibosTableComponent } from './recibos-table/recibos-table.component';
import { ReciboFormComponent } from './recibo-form/recibo-form.component';
import { ReciboPartidasComponent } from './recibo-partidas/recibo-partidas.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisTotalesPanelComponent,
  FacturasTableComponent,
  AnalisisTableComponent,
  AnalisisFormComponent,
  AnalisisEditFormComponent,
  AnalisisPartidasTableComponent,
  PrintAnalisisComponent,
  FacturaSelectorComponent,
  FacturasSelectorBtnComponent,
  CxpFacturasTableComponent,
  FacturaHeaderComponent,
  ComsSelectorComponent,
  ComsTableComponent,
  RequisicionesTableComponent,
  RequisicionFormComponent,
  RequisicionPartidasComponent,
  PrintRequisicionComponent,
  AgregarFacturasComponent,
  NotasTableComponent,
  ReportComsSinAnalizarComponent,
  NotaFormComponent,
  NotaConceptosComponent,
  SelectorCxPComponent,
  RecibosTableComponent,
  ReciboFormComponent,
  ReciboPartidasComponent
];

export const entryComponents = [
  FacturaSelectorComponent,
  ComsSelectorComponent,
  ReportComsSinAnalizarComponent
];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-totales-panel/cfdis-totales-panel.component';
export * from './facturas-table/facturas-table.component';
export * from './analisis-table/analisis-table.component';
export * from './analisis-form/analisis-form.component';
export * from './analisis-edit-form/analisis-edit-form.component';
export * from './analisis-edit-form/analisis-partidas-table.component';
export * from './print-analisis/print-analisis.component';
export * from './factura-selector/factura-selector.component';
export * from './factura-selector/factura-selector-btn.component';
export * from './cxp-facturas-table/cxp-facturas-table.component';
export * from './factura-header/factura-header.component';
export * from './coms-selector/coms-selector.component';
export * from './coms-table/coms-table.component';
export * from './report-coms-sin-analizar/report-coms-sin-analizar.component';

// Requisiciones
export * from './requisiciones-table/requisiciones-table.component';
export * from './requisicion-form/requisicion-form.component';
export * from './requisicion-partidas/requisicion-partidas.component';
export * from './requisicion-form/agregar-facturas.component';
export * from './print-requisicion/print-requisicion.component';

// Notas de credito
export * from './notas-table/notas-table.component';
export * from './nota-form/nota-form.component';
export * from './nota-conceptos/nota-conceptos.component';

// Cuentas Por Pagar
export * from './selector-cxp/selector-cxp.component';

// Contrarecibos
export * from './recibos-table/recibos-table.component';
export * from './recibo-form/recibo-form.component';
export * from './recibo-partidas/recibo-partidas.component';
