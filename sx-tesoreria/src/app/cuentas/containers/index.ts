import { CuentasPageComponent } from './cuentas-page/cuentas-page.component';
import { CuentasCardComponent } from './cuentas-card/cuentas-card.component';
import { SaldoCardComponent } from './saldo-card/saldo-card.component';
import { EgresosCardComponent } from './egresos-card/egresos-card.component';
import { IngresosCardComponent } from './ingresos-card/ingresos-card.component';
import { EstadoDeCuentaComponent } from './estado-de-cuenta/estado-de-cuenta.component';

export const containers: any[] = [
  CuentasPageComponent,
  CuentasCardComponent,
  SaldoCardComponent,
  EgresosCardComponent,
  IngresosCardComponent,
  EstadoDeCuentaComponent
];

export * from './cuentas-page/cuentas-page.component';
export * from './cuentas-card/cuentas-card.component';
export * from './saldo-card/saldo-card.component';
export * from './egresos-card/egresos-card.component';
export * from './ingresos-card/ingresos-card.component';
export * from './estado-de-cuenta/estado-de-cuenta.component';
