import { Periodo } from 'app/_core/models/periodo';
import * as moment from 'moment';

export interface EjercicioMes {
  ejercicio: number;
  mes: number;
}

export function buildCurrentPeriodo(): EjercicioMes {
  const now = moment();
  return {
    ejercicio: now.year(),
    mes: now.month() + 1
  };
}
