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
