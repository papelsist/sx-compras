import { Proveedor } from 'app/proveedores/models/proveedor';

export interface CuentaPorPagar {
  id: string;
  proveedor?: Partial<Proveedor>;
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
  vencido?: number;
  atraso?: number;
  importePorPagar?: number;
  vencimiento: string;
  selected?: boolean;
  comprobanteFiscal: { id: string };
  analizada?: boolean;
  analisis?: string;
  updateUser?: string;
  totalMn?: number;
  saldoMn?: number;
  pagosMn?: number;
  compensacionesMn?: number;
}
