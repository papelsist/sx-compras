import { EnviosFilterLabelComponent } from './envios-filter/envios-filter-label.component';
import { EnviosFilterBtnComponent } from './envios-filter/envios-filter-btn.component';
import { EnviosFilterComponent } from './envios-filter/envios-filter.component';
import { EnvioComisionesTableComponent } from './envio-comisiones-table/envio-comisiones-table.component';
import { PrestamoChoferTableComponent } from './prestamos-chofer-table/prestamo-chofer-table.component';
import { EnvioComisionFormComponent } from './envio-comision-form/envio-comision-form.component';

export const components: any[] = [
  EnviosFilterLabelComponent,
  EnviosFilterBtnComponent,
  EnviosFilterComponent,
  EnvioComisionesTableComponent,
  // Prestamos chofer
  PrestamoChoferTableComponent,
  EnvioComisionFormComponent
];

export const entryComponents = [
  EnviosFilterComponent,
  EnvioComisionFormComponent
];

export * from './envios-filter/envios-filter-label.component';
export * from './envios-filter/envios-filter-btn.component';
export * from './envios-filter/envios-filter.component';
export * from './envio-comisiones-table/envio-comisiones-table.component';

export * from './prestamos-chofer-table/prestamo-chofer-table.component';
export * from './envio-comision-form/envio-comision-form.component';
