import { Cliente } from 'app/models';
import { NotaDeCreditoDet } from './nota-de-credito-det';
import { AplicacionDeCobro } from './aplicacionDeCobro';

export interface NotaDeCredito {
  id?: string;
  cliente: Partial<Cliente>;
  nombre: string;
  fecha: string;
  serie: string;
  folio: number;
  tipo: 'BONIFICACION' | 'DEVOLUCION';
  tipoCartera: 'CRE' | 'CON' | 'CHE' | 'JUR' | 'COD';
  moneda: 'MXN' | 'USD';
  tc: number;
  importe: number;
  descuento: number;
  descuento2: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  disponible?: number;
  financiero: boolean;
  comentario: string;
  cfdi: { id: string; uuid: string };
  sucursal: string;
  cobro?: any;
  usoDeCfdi: string;
  formaDePago: string;
  partidas: Partial<NotaDeCreditoDet>[];
  aplicaciones?: Partial<AplicacionDeCobro>[];
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}
