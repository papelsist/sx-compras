import { Proveedor } from '../../proveedores/models/proveedor';
import { Periodo } from '../../_core/models/periodo';

export interface CuentaPorPagar {
  id: string;
  nombre: string;
  tipo: string;
  folio: string;
  uuid: string;
  serie: string;
  fecha: string;
  subTotal: number;
  descuento: number;
  impuestoTrasladado: number;
  impuestoRetenido: number;
  moneda: string;
  tipoDeCambio: number;
  tcContable?: number;
  total: number;
  pagos?: number;
  compensaciones?: number;
  saldo?: number;
  importePorPagar?: number;
  vencimiento: string;
  selected?: boolean;
  comprobanteFiscal: { id: string };
  analizada?: boolean;
  analisis?: string;
}

export class CxPFilter {
  fechaInicial?: Date;
  fechaFinal?: Date;
  proveedor?: Partial<Proveedor>;
  registros?: number;
}

export function createCxPFilter(): CxPFilter {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(10);
  const registros = 20;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}
