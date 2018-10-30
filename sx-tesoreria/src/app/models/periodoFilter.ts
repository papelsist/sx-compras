import { Periodo } from 'app/_core/models/periodo';

export interface PeriodoFilter {
  fechaInicial: Date;
  fechaFinal: Date;
  registros?: number;
}

export function createPeriodoFilter(): PeriodoFilter {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(20);
  const registros = 20;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}
