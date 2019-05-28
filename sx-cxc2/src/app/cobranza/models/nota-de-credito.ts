import { Cliente } from 'app/models';
import { NotaDeCreditoDet } from './nota-de-credito-det';

export interface NotaDeCredito {
  id?: string;
  cliente: Partial<Cliente>;
  nombre: string;
  fecha: string;
  serie: string;
  folio: number;
  tipo: 'BONIFICACION' | 'DEVOLUCION';
  tipoCartera: 'CRE' | 'CON' | 'CHE' | 'JUR' | 'COD';
  tipoDeCalculo: 'PORCENTAJE' | 'PRORRATEO';
  baseDelCalculo: 'Saldo' | 'Importe';
  moneda: 'MXN' | 'USD';
  tc: number;
  importe: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  descuento: number;
  descuento2: number;
  financiero: boolean;
  comentario: string;
  cfdi: { id: string; uuid: string };
  sucursal: string;
  cobro?: any;
  usoDeCfdi: string;
  devolucion?: any;
  formaDePago: string;
  partidas: Partial<NotaDeCreditoDet>[];
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}
