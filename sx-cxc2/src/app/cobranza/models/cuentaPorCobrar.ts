import { VentaCredito } from './ventaCredito';

export interface CuentaPorCobrar {
  id: string;
  cliente: {};
  sucursal: any;
  tipo: string;
  tipoDocumento: string;
  documento: number;
  importe: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  total: number;
  saldoReal: number;
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  cargo: number;
  comentario: string;
  uuid: string;
  cfdi: Object;
  fecha: string;
  vencimiento: string;
  pagos: number;
  saldo: number;
  atraso: number;
  cancelada?: string;
  credito: VentaCredito;
  selected?: boolean;
}
