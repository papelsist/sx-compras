import { EnviosFilterLabelComponent } from './envios-filter/envios-filter-label.component';
import { EnviosFilterBtnComponent } from './envios-filter/envios-filter-btn.component';
import { EnviosFilterComponent } from './envios-filter/envios-filter.component';
import { EnvioComisionesTableComponent } from './envio-comisiones-table/envio-comisiones-table.component';
import { EnvioComisionFormComponent } from './envio-comision-form/envio-comision-form.component';

import { PrestamosTableComponent } from './prestamos-table/prestamos-table.component';
import { PrestamoFormComponent } from './prestamo-form/prestamo-form.component';
import { FacturistasFieldComponent } from './facturista-field/facturista-field.component';
import { CargosTableComponent } from './cargos-table/cargos-table.component';
import { CargoFormComponent } from './cargo-form/cargo-form.component';

export const components: any[] = [
  EnviosFilterLabelComponent,
  EnviosFilterBtnComponent,
  EnviosFilterComponent,
  EnvioComisionesTableComponent,
  EnvioComisionFormComponent,
  // Prestamos chofer
  PrestamosTableComponent,
  PrestamoFormComponent,
  FacturistasFieldComponent,
  // Otros cargos
  CargosTableComponent,
  CargoFormComponent
];

export const entryComponents = [
  EnviosFilterComponent,
  EnvioComisionFormComponent,
  PrestamoFormComponent,
  CargoFormComponent
];

export * from './envios-filter/envios-filter-label.component';
export * from './envios-filter/envios-filter-btn.component';
export * from './envios-filter/envios-filter.component';
export * from './envio-comisiones-table/envio-comisiones-table.component';
export * from './envio-comision-form/envio-comision-form.component';

export * from './prestamos-table/prestamos-table.component';
export * from './prestamo-form/prestamo-form.component';

export * from './facturista-field/facturista-field.component';

// Otros cargos
export * from './cargos-table/cargos-table.component';
export * from './cargo-form/cargo-form.component';
