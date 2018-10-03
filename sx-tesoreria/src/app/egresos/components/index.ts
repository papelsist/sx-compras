import { RequisicionesTableComponent } from './requisiciones-table/requisiciones-table.component';
import { RequisicionesFilterComponent } from './requisiciones-filter/requisiciones-filter.component';
import { RequisicionesFilterBtnComponent } from './requisiciones-filter/requisiciones-filter-btn.component';
import { RequisicionesFilterLabelComponent } from './requisiciones-filter/requisiciones-filter-label.component';
import { PrintRequisicionComponent } from './print-requisicion/print-requisicion.component';
import { RequisicionPagoComponent } from './requisicion-pago/requisicion-pago.component';
import { RequisicionPartidasComponent } from './requisicion-partidas/requisicion-partidas.component';

export const components: any[] = [
  RequisicionesTableComponent,
  RequisicionesFilterComponent,
  RequisicionesFilterBtnComponent,
  RequisicionesFilterLabelComponent,
  PrintRequisicionComponent,
  RequisicionPagoComponent,
  RequisicionPartidasComponent
];

export const entryComponents: any[] = [RequisicionesFilterComponent];

export * from './requisiciones-table/requisiciones-table.component';
export * from './requisiciones-filter/requisiciones-filter-btn.component';
export * from './requisiciones-filter/requisiciones-filter-label.component';
export * from './print-requisicion/print-requisicion.component';
export * from './requisicion-pago/requisicion-pago.component';
export * from './requisicion-partidas/requisicion-partidas.component';
