import { EnviosFilterLabelComponent } from './envios-filter/envios-filter-label.component';
import { EnviosFilterBtnComponent } from './envios-filter/envios-filter-btn.component';
import { EnviosFilterComponent } from './envios-filter/envios-filter.component';
import { EnvioComisionesTableComponent } from './envio-comisiones-table/envio-comisiones-table.component';

export const components: any[] = [
  EnviosFilterLabelComponent,
  EnviosFilterBtnComponent,
  EnviosFilterComponent,
  EnvioComisionesTableComponent
];

export const entryComponents = [EnviosFilterComponent];

export * from './envios-filter/envios-filter-label.component';
export * from './envios-filter/envios-filter-btn.component';
export * from './envios-filter/envios-filter.component';
export * from './envio-comisiones-table/envio-comisiones-table.component';
