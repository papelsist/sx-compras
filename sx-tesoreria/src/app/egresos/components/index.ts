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

import { RembolsoPartidasComponent } from './rembolso-partidas/rembolso-partidas.component';
import { RembolsosTableComponent } from './rembolsos-table/rembolsos-table.component';
import { RembolsosFilterComponent } from './rembolsos-filter/rembolsos-filter.component';
import { RembolsosFilterBtnComponent } from './rembolsos-filter/rembolsos-filter-btn.component';
import { RembolsosFilterLabelComponent } from './rembolsos-filter/rembolsos-filter-label.component';
import { PrintRembolsoComponent } from './print-rembolso/print-rembolso.component';
import { RembolsoPagoComponent } from './rembolso-pago/rembolso-pago.component';
import { RembolsoPagoDialogComponent } from './rembolso-pago-dialog/rembolos-pago-dialog.component';
import { RembolsoPagoDialogBtnComponent } from './rembolso-pago-dialog/rembolso-pago-dialog-btn.component';
import { CancelarPagoRembolsoComponent } from './cancelaciones/cancelar-pago-rembolso.component';
import { CancelarChequeRembolsoComponent } from './cancelaciones/cancelar-cheque-rembolso.component';
import { GenerarChequeRembolsoComponent } from './generar-cheque-rembolso/generar-cheque-rembolso.component';
import { GenerarChequeRembolsoBtnComponent } from './generar-cheque-rembolso/generar-cheque-rembolso-btn.component';
import { ComprasMonedaTableComponent } from './compras-moneda-table/compras-moneda-table.component';
import { CompraMonedaFormComponent } from './compra-moneda-form/compra-moneda-form.component';
import { PagosNominaTableComponent } from './pagos-nomina-table/pagos-nomina-table.component';
import { PagoNominaImportarDialogComponent } from './pago-nomina-importar/pago-nomina-importar-dialog.component';
import { PagoDeNominaDialogComponent } from './pago-nomina-dialog/pago-nomina-dialog.component';
import { PagoDeNominaBtnComponent } from './pago-nomina-dialog/pago-nomina-dialog-btn.component';
import { PagoDeNominaFormComponent } from './pago-nomina-form/pago-de-nomina-form.component';
import { PagoMorrallasTableComponent } from './pago-morrallas-table/pago-morrallas-table.component';
import { PagoMorrallaFormComponent } from './pago-morralla-form/pago-morralla-form.component';
import { MorrallasTableComponent } from './selector-morralla/morrallas-table.component';
import { SelectorMorrallaComponent } from './selector-morralla/selector-morralla.component';
import { SelectorMorrallaBtnComponent } from './selector-morralla/selector-morralla-btn.component';
import { DevolucionesTableComponent } from './devoluciones-table/devoluciones-table.component';
import { DevolucionFormComponent } from './devolucion-form/devolucion-form.component';

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
  PolizaChequeComponent,

  //
  RembolsoPagoComponent,
  RembolsosTableComponent,
  RembolsoPartidasComponent,
  RembolsosFilterComponent,
  RembolsosFilterBtnComponent,
  RembolsosFilterLabelComponent,
  PrintRembolsoComponent,
  RembolsoPagoDialogComponent,
  RembolsoPagoDialogBtnComponent,
  CancelarPagoRembolsoComponent,
  CancelarChequeRembolsoComponent,
  GenerarChequeRembolsoComponent,
  GenerarChequeRembolsoBtnComponent,
  //
  ComprasMonedaTableComponent,
  CompraMonedaFormComponent,
  // Pago de nomina
  PagosNominaTableComponent,
  PagoNominaImportarDialogComponent,
  PagoDeNominaDialogComponent,
  PagoDeNominaBtnComponent,
  PagoDeNominaFormComponent,

  // Morrallas
  PagoMorrallasTableComponent,
  PagoMorrallaFormComponent,
  MorrallasTableComponent,
  SelectorMorrallaComponent,
  SelectorMorrallaBtnComponent,

  // Devoluciones
  DevolucionesTableComponent,
  DevolucionFormComponent
];

export const entryComponents: any[] = [
  RequisicionesFilterComponent,
  PagoRequisicionDialogComponent,
  ChequesFilterComponent,
  GenerarChequeComponent,
  RembolsosFilterComponent,
  RembolsoPagoDialogComponent,
  GenerarChequeRembolsoComponent,
  CompraMonedaFormComponent,
  // Pago de nomina
  PagoNominaImportarDialogComponent,
  PagoDeNominaDialogComponent,

  // Morralla
  SelectorMorrallaComponent
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

// Rembolso
export * from './rembolso-pago/rembolso-pago.component';
export * from './rembolsos-table/rembolsos-table.component';
export * from './rembolso-partidas/rembolso-partidas.component';
export * from './rembolsos-filter/rembolsos-filter.component';
export * from './rembolsos-filter/rembolsos-filter-btn.component';
export * from './rembolsos-filter/rembolsos-filter-label.component';
export * from './print-rembolso/print-rembolso.component';
export * from './rembolso-pago-dialog/rembolos-pago-dialog.component';
export * from './rembolso-pago-dialog/rembolso-pago-dialog-btn.component';
export * from './cancelaciones/cancelar-pago-rembolso.component';
export * from './cancelaciones/cancelar-cheque-rembolso.component';
export * from './generar-cheque-rembolso/generar-cheque-rembolso.component';
export * from './generar-cheque-rembolso/generar-cheque-rembolso-btn.component';

// Compra de moneda
export * from './compras-moneda-table/compras-moneda-table.component';
export * from './compra-moneda-form/compra-moneda-form.component';

// Pago de nomina
export * from './pagos-nomina-table/pagos-nomina-table.component';
export * from './pago-nomina-importar/pago-nomina-importar-dialog.component';
export * from './pago-nomina-dialog/pago-nomina-dialog.component';
export * from './pago-nomina-dialog/pago-nomina-dialog-btn.component';
export * from './pago-nomina-form/pago-de-nomina-form.component';

// Morrallas
export * from './pago-morrallas-table/pago-morrallas-table.component';
export * from './pago-morralla-form/pago-morralla-form.component';
export * from './pago-morrallas-table/pago-morrallas-table.component';
export * from './selector-morralla/selector-morralla.component';
export * from './selector-morralla/selector-morralla-btn.component';

// Devoluciones
export * from './devoluciones-table/devoluciones-table.component';
export * from './devolucion-form/devolucion-form.component';
