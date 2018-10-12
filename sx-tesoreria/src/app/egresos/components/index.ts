import { RequisicionesTableComponent } from './requisiciones-table/requisiciones-table.component';
import { RequisicionesFilterComponent } from './requisiciones-filter/requisiciones-filter.component';
import { RequisicionesFilterBtnComponent } from './requisiciones-filter/requisiciones-filter-btn.component';
import { RequisicionesFilterLabelComponent } from './requisiciones-filter/requisiciones-filter-label.component';
import { PrintRequisicionComponent } from './print-requisicion/print-requisicion.component';

import { PagoRequisicionComponent } from './pago-requisicion/pago-requisicion.component';
import { PagoRequisicionDialogComponent } from './pago-requisicion-dialog/pago-requisicion-dialog.component';
import { PagoRequisicionDialogBtnComponent } from './pago-requisicion-dialog/pago-requisicion-dialog-btn.component';

import { PrintChequeComponent } from './print-cheque/print-cheque.component';
import { RequisicionPartidasComponent } from './requisicion-partidas/requisicion-partidas.component';

// Cheques
import { ChequesTableComponent } from './cheques-table/cheques-table.component';
import { ChequesFilterComponent } from './cheques-filter/cheques-filter.component';
import { ChequesFilterBtnComponent } from './cheques-filter/cheques-filter-btn.component';
import { ChequesFilterLabelComponent } from './cheques-filter/cheques-filter-label.component';
import { GenerarChequeComponent } from './generar-cheque/generar-cheque.component';
import { GenerarChequeBtnComponent } from './generar-cheque/generar-cheque-btn.component';
import { CancelarChequeComponent } from './cancelaciones/cancelar-cheque.component';
import { CancelarPagoComponent } from './cancelaciones/cancelar-pago.component';
import { PolizaChequeComponent } from './poliza-cheque/poliza-cheque.component';

export const components: any[] = [
  RequisicionesTableComponent,
  RequisicionesFilterComponent,
  RequisicionesFilterBtnComponent,
  RequisicionesFilterLabelComponent,
  PrintRequisicionComponent,
  PagoRequisicionComponent,
  RequisicionPartidasComponent,
  PagoRequisicionDialogComponent,
  PagoRequisicionDialogBtnComponent,
  PrintChequeComponent,
  // Cheques
  ChequesTableComponent,
  ChequesFilterComponent,
  ChequesFilterBtnComponent,
  ChequesFilterLabelComponent,
  GenerarChequeComponent,
  GenerarChequeBtnComponent,
  CancelarChequeComponent,
  CancelarPagoComponent,
  PolizaChequeComponent
];

export const entryComponents: any[] = [
  RequisicionesFilterComponent,
  PagoRequisicionDialogComponent,
  GenerarChequeComponent
];

export * from './requisiciones-table/requisiciones-table.component';
export * from './requisiciones-filter/requisiciones-filter-btn.component';
export * from './requisiciones-filter/requisiciones-filter-label.component';
export * from './print-requisicion/print-requisicion.component';
export * from './pago-requisicion/pago-requisicion.component';
export * from './requisicion-partidas/requisicion-partidas.component';
export * from './pago-requisicion-dialog/pago-requisicion-dialog.component';
export * from './pago-requisicion-dialog/pago-requisicion-dialog-btn.component';
export * from './print-cheque/print-cheque.component';
// Cheques
export * from './cheques-table/cheques-table.component';
export * from './cheques-filter/cheques-filter.component';
export * from './cheques-filter/cheques-filter-btn.component';
export * from './cheques-filter/cheques-filter-label.component';
export * from './generar-cheque/generar-cheque.component';
export * from './generar-cheque/generar-cheque-btn.component';
export * from './cancelaciones/cancelar-cheque.component';
export * from './cancelaciones/cancelar-pago.component';
export * from './poliza-cheque/poliza-cheque.component';