import { ReportButtonComponent } from './report-button/report-button.component';
import { RepPeriodoSucursalComponent } from './rep-periodo-sucursal/rep-periodo-sucursal.component';
import { RelacionPagosComponent } from './relacion-pagos.component';
import { RelacionFichasComponent } from './relacion-fichas.component';
import { RepComisionTarjetasComponent } from './rep-comision-tarjetas/rep-comision-tarjetas.component';

export const components: any[] = [
  ReportButtonComponent,
  RepPeriodoSucursalComponent,
  RelacionPagosComponent,
  RelacionFichasComponent,
  RepComisionTarjetasComponent
];

export const entryComponents: any[] = [
  RepPeriodoSucursalComponent,
  RelacionPagosComponent,
  RelacionFichasComponent,
  RepComisionTarjetasComponent
];

export * from './report-button/report-button.component';
export * from './rep-periodo-sucursal/rep-periodo-sucursal.component';
export * from './relacion-fichas.component';
export * from './rep-comision-tarjetas/rep-comision-tarjetas.component';
