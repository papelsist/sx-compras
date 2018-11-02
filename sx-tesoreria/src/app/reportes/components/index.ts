import { ReportButtonComponent } from './report-button/report-button.component';
import { RepPeriodoSucursalComponent } from './rep-periodo-sucursal/rep-periodo-sucursal.component';
import { RelacionPagosComponent } from './relacion-pagos.component';
import { RelacionFichasComponent } from './relacion-fichas.component';

export const components: any[] = [
  ReportButtonComponent,
  RepPeriodoSucursalComponent,
  RelacionPagosComponent,
  RelacionFichasComponent
];

export const entryComponents: any[] = [
  RepPeriodoSucursalComponent,
  RelacionPagosComponent,
  RelacionFichasComponent
];

export * from './report-button/report-button.component';
export * from './rep-periodo-sucursal/rep-periodo-sucursal.component';
export * from './relacion-fichas.component';
