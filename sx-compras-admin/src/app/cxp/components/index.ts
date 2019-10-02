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

import { RequisicionesFilterComponent } from './requisiciones-filter/requisiciones-filter.component';
import { RequisicionesFilterLabelComponent } from './requisiciones-filter/requisiciones-filter-label.component';
import { RequisicionesFilterBtnComponent } from './requisiciones-filter/requisiciones-filter-btn.component';

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
import { PagosTableComponent } from './pagos-table/pagos-table.component';
import { PagoFormComponent } from './pago-form/pago-form.component';
import { AplicacionesComponent } from './aplicaciones-table/aplicaciones-table.component';
import { AplicacionFormComponent } from './aplicacion-form/aplicacion-form.component';
import { NotaPrintComponent } from './nota-print/nota-print.component';
import { ProveedorPeriodoFilterDialogComponent } from './proveedor-periodo-filter/proveedor-periodo-filter-dialog.component';
import { ProveedorPeriodoFilterBtnComponent } from './proveedor-periodo-filter/proveedor-periodo-filter-btn.component';
import { ProveedorPeriodoFilterLabelComponent } from './proveedor-periodo-filter/proveedor-periodo-filter-label.component';
import { CfdisTable2Component } from './cfdis-table/cfdis-table2.component';
import { FacturasTable2Component } from './facturas-table2/facturas-table2.component';
import { NotasAnalisisTableComponent } from './notas-analisis-table/nota-analisis-table.component';
import { AnalisisDevolucionTableComponent } from './analisis-devolucion-table/analisis-devolucion-table.component';
import { SelectorDeDecsComponent } from './selector-de-decs/selector-de-decs.component';
import { AnalisisTrsTableComponent } from './analisis-trs-table/analisis-trs-table.component';
import { AnalisisTrsDialogComponent } from './analisis-trs-dialog/analisis-trs-dialog.component';
import { AnalisisTrsFormComponent } from './analisis-trs-form/analisis-trs.form.component';
import { SelectorDeTrsComponent } from './selector-de-trs/selector-de-trs.component';
import { AnalisisTrsPartidasComponent } from './analisis-trs-partidas/analisis-trs-partidas.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisTable2Component,
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
  ReciboPartidasComponent,
  PagosTableComponent,
  PagoFormComponent,
  AplicacionesComponent,
  AplicacionFormComponent,
  NotaPrintComponent,

  ProveedorPeriodoFilterDialogComponent,
  ProveedorPeriodoFilterBtnComponent,
  ProveedorPeriodoFilterLabelComponent,

  RequisicionesFilterComponent,
  RequisicionesFilterLabelComponent,
  RequisicionesFilterBtnComponent,
  FacturasTable2Component,

  NotasAnalisisTableComponent,
  AnalisisDevolucionTableComponent,
  SelectorDeDecsComponent,

  AnalisisTrsTableComponent,
  AnalisisTrsDialogComponent,
  AnalisisTrsFormComponent,
  SelectorDeTrsComponent,
  AnalisisTrsPartidasComponent
];

export const entryComponents = [
  FacturaSelectorComponent,
  ComsSelectorComponent,
  ReportComsSinAnalizarComponent,
  AplicacionFormComponent,
  ProveedorPeriodoFilterDialogComponent,
  RequisicionesFilterComponent,
  SelectorDeDecsComponent,
  AnalisisTrsDialogComponent,
  SelectorDeTrsComponent
];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-table/cfdis-table2.component';
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

export * from './requisiciones-filter/requisiciones-filter.component';
export * from './requisiciones-filter/requisiciones-filter-label.component';
export * from './requisiciones-filter/requisiciones-filter-btn.component';

// Notas de credito
export * from './notas-table/notas-table.component';
export * from './nota-form/nota-form.component';
export * from './nota-conceptos/nota-conceptos.component';
export * from './nota-print/nota-print.component';

// Cuentas Por Pagar
export * from './selector-cxp/selector-cxp.component';

// Contrarecibos
export * from './recibos-table/recibos-table.component';
export * from './recibo-form/recibo-form.component';
export * from './recibo-partidas/recibo-partidas.component';

export * from './pagos-table/pagos-table.component';
export * from './pago-form/pago-form.component';
export * from './aplicaciones-table/aplicaciones-table.component';
export * from './aplicacion-form/aplicacion-form.component';

export * from './proveedor-periodo-filter/proveedor-periodo-filter-dialog.component';
export * from './proveedor-periodo-filter/proveedor-periodo-filter-btn.component';
export * from './proveedor-periodo-filter/proveedor-periodo-filter-label.component';

export * from './facturas-table2/facturas-table2.component';

export * from './notas-analisis-table/nota-analisis-table.component';
export * from './analisis-devolucion-table/analisis-devolucion-table.component';
export * from './selector-de-decs/selector-de-decs.component';

export * from './analisis-trs-table/analisis-trs-table.component';
export * from './analisis-trs-dialog/analisis-trs-dialog.component';
export * from './analisis-trs-form/analisis-trs.form.component';
export * from './selector-de-trs/selector-de-trs.component';
export * from './analisis-trs-partidas/analisis-trs-partidas.component';
