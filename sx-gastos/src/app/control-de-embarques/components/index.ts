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
import { EntregasPorChoferDialogComponent } from './comisiones-report/entregas-por-chofer-dialog.component';
import { ChoferFieldComponent } from './chofer-field/chofer-field.component';
import { ComisionesPorFacturistaDialogComponent } from './comisiones-report/comisiones-facturista-dialog.component';

import { SelectorDeFacturistaComponent } from './selector-de-facturista/selector-de-facturista.component';
import { EstadoDeCuentaTableComponent } from './estado-de-cuenta-table/estado-de-cuenta-table.component';
import { PrestamoInteresesFormComponent } from './prestamo-intereses/prestamo-intereses-form.component';
import { AnalisisDeEmbarquesDialogComponent } from './comisiones-report/analisis-de-embarques.dialog.component';
import { FacturistasTableComponent } from './facturistas-table/facturistas-table.component';
import { FacturistaFormComponent } from './facturista-form/facturista-form.component';

export const components: any[] = [
  EnviosFilterLabelComponent,
  EnviosFilterBtnComponent,
  EnviosFilterComponent,
  EnvioComisionesTableComponent,
  EnvioComisionFormComponent,
  // Prestamos chofer
  PrestamosTableComponent,
  PrestamoFormComponent,
  PrestamoInteresesFormComponent,

  FacturistasFieldComponent,
  FacturistasTableComponent,
  FacturistaFormComponent,

  // Otros cargos
  CargosTableComponent,
  CargoFormComponent,
  ChoferFieldComponent,

  // Reportes
  EntregasPorChoferDialogComponent,
  ComisionesPorFacturistaDialogComponent,
  AnalisisDeEmbarquesDialogComponent,

  SelectorDeFacturistaComponent,

  // Estado de cuenta
  EstadoDeCuentaTableComponent
];

export const entryComponents = [
  EnviosFilterComponent,
  EnvioComisionFormComponent,
  PrestamoFormComponent,
  PrestamoInteresesFormComponent,
  CargoFormComponent,
  EntregasPorChoferDialogComponent,
  ComisionesPorFacturistaDialogComponent,
  SelectorDeFacturistaComponent,
  AnalisisDeEmbarquesDialogComponent
];

export * from './envios-filter/envios-filter-label.component';
export * from './envios-filter/envios-filter-btn.component';
export * from './envios-filter/envios-filter.component';
export * from './envio-comisiones-table/envio-comisiones-table.component';
export * from './envio-comision-form/envio-comision-form.component';

export * from './prestamos-table/prestamos-table.component';
export * from './prestamo-form/prestamo-form.component';
export * from './prestamo-intereses/prestamo-intereses-form.component';

// Facturistas
export * from './facturista-field/facturista-field.component';
export * from './facturistas-table/facturistas-table.component';
export * from './facturista-form/facturista-form.component';

// Otros cargos
export * from './cargos-table/cargos-table.component';
export * from './cargo-form/cargo-form.component';

export * from './chofer-field/chofer-field.component';

// Reports
export * from './comisiones-report/entregas-por-chofer-dialog.component';
export * from './comisiones-report/comisiones-facturista-dialog.component';
export * from './comisiones-report/analisis-de-embarques.dialog.component';

export * from './selector-de-facturista/selector-de-facturista.component';

export * from './estado-de-cuenta-table/estado-de-cuenta-table.component';
