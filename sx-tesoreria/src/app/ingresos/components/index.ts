import { CobrosTableComponent } from './cobros-table/cobros-table.component';
import { CobrosFilterComponent } from './cobros-filter/cobros-filter.component';
import { CobrosFilterBtnComponent } from './cobros-filter/cobros-filter-btn.component';
import { CobrosFilterLabelComponent } from './cobros-filter/cobros-filter-label.component';
import { CobroFormComponent } from './cobro-form/cobro-form-component';
import { CobrosChequeTableComponent } from './selecor-de-cheques/cobros-cheque-table.component';
import { SelectorDeCobrosChequeComponent } from './selecor-de-cheques/selector-de-cobros-cheques.component';

export const components: any[] = [
  // Cobros
  CobrosTableComponent,
  CobrosFilterComponent,
  CobrosFilterBtnComponent,
  CobrosFilterLabelComponent,
  CobroFormComponent,
  CobrosChequeTableComponent,
  SelectorDeCobrosChequeComponent
];
export const entryComponents: any[] = [
  CobrosFilterComponent,
  CobroFormComponent,
  SelectorDeCobrosChequeComponent
];

// Cobros
export * from './cobros-table/cobros-table.component';
export * from './cobros-filter/cobros-filter.component';
export * from './cobros-filter/cobros-filter-btn.component';
export * from './cobros-filter/cobros-filter-label.component';
export * from './cobro-form/cobro-form-component';

// Cheques devueltos
export * from './selecor-de-cheques/cobros-cheque-table.component';
export * from './selecor-de-cheques/selector-de-cobros-cheques.component';
