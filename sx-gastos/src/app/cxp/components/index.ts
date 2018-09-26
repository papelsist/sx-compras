import { CfdisTableComponent } from './cfdis-table/cfdis-table.component';
import { CfdisTotalesPanelComponent } from './cfdis-totales-panel/cfdis-totales-panel.component';
import { FacturaSelectorComponent } from './factura-selector/factura-selector.component';
import { FacturasSelectorBtnComponent } from './factura-selector/factura-selector-btn.component';
import { CxpFacturasTableComponent } from './cxp-facturas-table/cxp-facturas-table.component';
import { FacturaHeaderComponent } from './factura-header/factura-header.component';
import { ComsSelectorComponent } from './coms-selector/coms-selector.component';
import { ComsTableComponent } from './coms-table/coms-table.component';
// Requisiciones
import { RequisicionesTableComponent } from './requisiciones-table/requisiciones-table.component';
import { RequisicionFormComponent } from './requisicion-form/requisicion-form.component';
import { RequisicionPartidasComponent } from './requisicion-partidas/requisicion-partidas.component';
import { AgregarFacturasComponent } from './requisicion-form/agregar-facturas.component';
import { PrintRequisicionComponent } from './print-requisicion/print-requisicion.component';
// Notas
import { NotasTableComponent } from './notas-table/notas-table.component';
import { NotaFormComponent } from './nota-form/nota-form.component';
import { NotaConceptosComponent } from './nota-conceptos/nota-conceptos.component';
import { FacturasTableComponent } from './facturas-table/facturas-table.component';
import { SelectorCxPComponent } from './selector-cxp/selector-cxp.component';
import { PagosTableComponent } from './pagos-table/pagos-table.component';
import { PagoFormComponent } from './pago-form/pago-form.component';
import { AplicacionesComponent } from './aplicaciones-table/aplicaciones-table.component';
import { AplicacionFormComponent } from './aplicacion-form/aplicacion-form.component';
import { NotaPrintComponent } from './nota-print/nota-print.component';
import { CfdisFilterComponent } from './cfdis-filter/cfdis-filter.component';
import { CfdisFilterLabelComponent } from './cfdis-filter/cfdis-filter-label.component';

import { CfdisFilterBtnComponent } from './cfdis-filter/cfdis-filter-btn.component';
import { CfdisConceptosTableComponent } from './cfdi-conceptos-table/cfdi-conceptos-table.component';
import { FacturasFilterComponent } from './facturas-filter/facturas-filter.component';
import { FacturasFilterBtnComponent } from './facturas-filter/facturas-filter-btn.component';
import { FacturasFilterLabelComponent } from './facturas-filter/facturas-filter-label.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisTotalesPanelComponent,
  CfdisFilterComponent,
  CfdisFilterLabelComponent,
  CfdisFilterBtnComponent,
  CfdisConceptosTableComponent,
  FacturasTableComponent,
  FacturaSelectorComponent,
  FacturasSelectorBtnComponent,
  CxpFacturasTableComponent,
  FacturaHeaderComponent,
  FacturasFilterComponent,
  FacturasFilterBtnComponent,
  FacturasFilterLabelComponent,
  ComsSelectorComponent,
  ComsTableComponent,
  RequisicionesTableComponent,
  RequisicionFormComponent,
  RequisicionPartidasComponent,
  PrintRequisicionComponent,
  AgregarFacturasComponent,
  NotasTableComponent,
  NotaFormComponent,
  NotaConceptosComponent,
  SelectorCxPComponent,
  PagosTableComponent,
  PagoFormComponent,
  AplicacionesComponent,
  AplicacionFormComponent,
  NotaPrintComponent
];

export const entryComponents = [
  FacturaSelectorComponent,
  ComsSelectorComponent,
  AplicacionFormComponent,
  CfdisFilterComponent,
  FacturasFilterComponent
];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-totales-panel/cfdis-totales-panel.component';
export * from './cfdis-filter/cfdis-filter.component';
export * from './cfdis-filter/cfdis-filter-btn.component';
export * from './cfdis-filter/cfdis-filter-label.component';
export * from './cfdi-conceptos-table/cfdi-conceptos-table.component';

export * from './facturas-table/facturas-table.component';
export * from './factura-selector/factura-selector.component';
export * from './factura-selector/factura-selector-btn.component';
export * from './cxp-facturas-table/cxp-facturas-table.component';
export * from './factura-header/factura-header.component';

export * from './facturas-filter/facturas-filter.component';
export * from './facturas-filter/facturas-filter-label.component';
export * from './facturas-filter/facturas-filter-btn.component';

export * from './coms-selector/coms-selector.component';
export * from './coms-table/coms-table.component';

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
export * from './nota-print/nota-print.component';

// Cuentas Por Pagar
export * from './selector-cxp/selector-cxp.component';

export * from './pagos-table/pagos-table.component';
export * from './pago-form/pago-form.component';
export * from './aplicaciones-table/aplicaciones-table.component';
export * from './aplicacion-form/aplicacion-form.component';
