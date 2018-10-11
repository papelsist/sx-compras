import { RequisicionesTableComponent } from './requisiciones-table/requisiciones-table.component';
import { RequisicionesFilterComponent } from './requisiciones-filter/requisiciones-filter.component';
import { RequisicionesFilterBtnComponent } from './requisiciones-filter/requisiciones-filter-btn.component';
import { RequisicionesFilterLabelComponent } from './requisiciones-filter/requisiciones-filter-label.component';
import { PrintRequisicionComponent } from './print-requisicion/print-requisicion.component';
import { RequisicionPagoComponent } from './requisicion-pago/requisicion-pago.component';
import { RequisicionPartidasComponent } from './requisicion-partidas/requisicion-partidas.component';
import { PagoDeRequisicionComponent } from './pago-de-requisicion/pago-de-requisicion.component';
import { PagoDeRequisicionBtnComponent } from './pago-de-requisicion/pago-de-requisicion-btn.component';
import { PrintChequeComponent } from './print-cheque/print-cheque.component';
// Cheques
import { ChequesTableComponent } from './cheques-table/cheques-table.component';
import { ChequesFilterComponent } from './cheques-filter/cheques-filter.component';
import { ChequesFilterBtnComponent } from './cheques-filter/cheques-filter-btn.component';
import { ChequesFilterLabelComponent } from './cheques-filter/cheques-filter-label.component';
import { GenerarChequeComponent } from './generar-cheque/generar-cheque.component';
import { GenerarChequeBtnComponent } from './generar-cheque/generar-cheque-btn.component';

export const components: any[] = [
  RequisicionesTableComponent,
  RequisicionesFilterComponent,
  RequisicionesFilterBtnComponent,
  RequisicionesFilterLabelComponent,
  PrintRequisicionComponent,
  RequisicionPagoComponent,
  RequisicionPartidasComponent,
  PagoDeRequisicionComponent,
  PagoDeRequisicionBtnComponent,
  PrintChequeComponent,
  // Cheques
  ChequesTableComponent,
  ChequesFilterComponent,
  ChequesFilterBtnComponent,
  ChequesFilterLabelComponent,
  GenerarChequeComponent,
  GenerarChequeBtnComponent
];

export const entryComponents: any[] = [
  RequisicionesFilterComponent,
  PagoDeRequisicionComponent,
  GenerarChequeComponent
];

export * from './requisiciones-table/requisiciones-table.component';
export * from './requisiciones-filter/requisiciones-filter-btn.component';
export * from './requisiciones-filter/requisiciones-filter-label.component';
export * from './print-requisicion/print-requisicion.component';
export * from './requisicion-pago/requisicion-pago.component';
export * from './requisicion-partidas/requisicion-partidas.component';
export * from './pago-de-requisicion/pago-de-requisicion.component';
export * from './pago-de-requisicion/pago-de-requisicion-btn.component';
export * from './print-cheque/print-cheque.component';
// Cheques
export * from './cheques-table/cheques-table.component';
export * from './cheques-filter/cheques-filter.component';
export * from './cheques-filter/cheques-filter-btn.component';
export * from './cheques-filter/cheques-filter-label.component';
export * from './generar-cheque/generar-cheque.component';
export * from './generar-cheque/generar-cheque-btn.component';
