import { Periodo } from 'app/_core/models/periodo';

export interface PeriodoFilter {
  fechaInicial: Date;
  fechaFinal: Date;
  registros?: number;
}

export function createPeriodoFilter(dias = 20): PeriodoFilter {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(dias);
  const registros = 20;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}
