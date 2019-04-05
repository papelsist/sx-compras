import { CobrosFilterComponent } from './cobros-filter/cobros-filter.component';
import { CobrosFilterBtnComponent } from './cobros-filter/cobros-filter-btn.component';
import { CobrosFilterLabelComponent } from './cobros-filter/cobros-filter-label.component';
import { CobrosTableComponent } from './cobros-table/cobros-table.component';

export const components: any[] = [
  CobrosFilterComponent,
  CobrosFilterBtnComponent,
  CobrosFilterLabelComponent,
  CobrosTableComponent
];

export const entryComponents: any[] = [CobrosFilterComponent];

export * from './cobros-filter/cobros-filter-btn.component';
export * from './cobros-filter/cobros-filter-label.component';
export * from './cobros-filter/cobros-filter.component';

export * from './cobros-table/cobros-table.component';
