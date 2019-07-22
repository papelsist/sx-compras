import { Proveedor } from 'app/proveedores/models/proveedor';
import { Periodo } from 'app/_core/models/periodo';

export interface ProveedorPeriodoFilter {
  fechaInicial: Date;
  fechaFinal: Date;
  proveedor?: Partial<Proveedor>;
  registros: number;
}

export function buildProveedorPeriodoFilter(
  registros: number = 100
): ProveedorPeriodoFilter {
  const periodo = Periodo.fromNow(30);
  return {
    fechaInicial: periodo.fechaInicial,
    fechaFinal: periodo.fechaFinal,
    registros
  };
}
