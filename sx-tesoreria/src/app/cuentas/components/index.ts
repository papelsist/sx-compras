import { CuentasTableComponent } from './cuentas-table/cuentas-table.component';
import { CuentaFormComponent } from './cuenta-form/cuenta-form.component';
import { BancoSatFieldComponent } from './banco-sat-field/banco-sat-field.component';
import { MovimientosTableComponent } from './movimientos-table/movimientos-table.component';
import { SelectorDeCuentasComponent } from './selector-de-cuentas/selector-de-cuentas.component';
import { EstadoDeCuentaTableComponent } from './estado-de-cuenta-table/estado-de-cuenta-table.component';

export const components: any[] = [
  CuentasTableComponent,
  CuentaFormComponent,
  BancoSatFieldComponent,
  MovimientosTableComponent,
  SelectorDeCuentasComponent,
  EstadoDeCuentaTableComponent
];

export const entryComponents: any[] = [
  CuentaFormComponent,
  SelectorDeCuentasComponent
];

export * from './cuentas-table/cuentas-table.component';
export * from './cuenta-form/cuenta-form.component';
export * from './banco-sat-field/banco-sat-field.component';
export * from './movimientos-table/movimientos-table.component';
export * from './selector-de-cuentas/selector-de-cuentas.component';
export * from './estado-de-cuenta-table/estado-de-cuenta-table.component';
