import { CuentaDeBanco } from 'app/models';

export class SaldoPorCuenta {
  id: string;
  cuenta: Partial<CuentaDeBanco>;
  saldoInicial: number;
  ingresos: number;
  egresos: number;
  saldoFinal: number;
  ejercicio: number;
  mes: number;
  cierre: string;
  dateCreated: string;
  lastUpdated: string;
}
