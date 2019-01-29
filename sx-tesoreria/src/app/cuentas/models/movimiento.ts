import { CuentaDeBanco } from 'app/models';

export interface Movimiento {
  id: string;
  cuenta: Partial<CuentaDeBanco>;
  afavor: string;
  fecha: string;
  formaDePago: string;
  tipo: string;
  referencia: string;
  concepto: string;
  conceptoReporte: string;
  importe: number;
  moneda: string;
  tipoDeCambio: number;
  comentario: string;
  createUser: string;
  updateUser: string;
  lastUpdated: string;
  dateCreated: string;
  cuentaNumero?: string;
  banco?: string;
  cheque?: any;
  deposito?: number;
  retiro?: number;
  fechaDeposito?: string;
}
