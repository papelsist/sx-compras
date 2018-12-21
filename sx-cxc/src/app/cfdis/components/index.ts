import { CfdisTableComponent } from './cfdis-table/cfdis-table.component';
import { CfdisPorCancelarTableComponent } from './cfdis-por-cancelar-table/cfdis-por-cancelar-table.component';
import { CancelacionesTableComponent } from './cancelaciones-table/cancelaciones-table.component';
import { CfdisFilterComponent } from './cfdis-filter/cfdis-filter.component';
import { CfdisFilterBtnComponent } from './cfdis-filter/cfdis-filter-btn.component';
import { CfdisFilterLabelComponent } from './cfdis-filter/cfdis-filter-label.component';

export const components: any[] = [
  CfdisTableComponent,
  CfdisPorCancelarTableComponent,
  CancelacionesTableComponent,
  CfdisFilterComponent,
  CfdisFilterBtnComponent,
  CfdisFilterLabelComponent
];

export const entryComponents: any[] = [CfdisFilterComponent];

export * from './cfdis-table/cfdis-table.component';
export * from './cfdis-por-cancelar-table/cfdis-por-cancelar-table.component';
export * from './cancelaciones-table/cancelaciones-table.component';
export * from './cfdis-filter/cfdis-filter.component';
export * from './cfdis-filter/cfdis-filter-btn.component';
export * from './cfdis-filter/cfdis-filter-label.component';
