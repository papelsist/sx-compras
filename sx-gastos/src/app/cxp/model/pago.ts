import { Proveedor } from '../../proveedores/models/proveedor';
import { AplicacionDePago } from './aplicacionDePago';
import { Requisicion } from './requisicion';
import { ComprobanteFiscal } from './comprobanteFiscal';

export interface Pago {
  id?: string;
  fecha: string;
  proveedor: Partial<Proveedor>;
  nombre: string;
  folio?: string;
  serie?: string;
  moneda: string;
  tipoDeCambio: number;
  formaDePago: string;
  total: number;
  aplicado?: number;
  disponible?: number;
  diferencia?: number;
  diferenciaFecha?: string;
  diferenciaConcepto?: string;
  comentario?: string;
  aplicaciones: Partial<AplicacionDePago>[];
  creado?: string;
  modificado?: string;
  createUser?: string;
  updateUser?: string;
  uuid?: string;
  comprobanteFiscal?: Partial<ComprobanteFiscal>;
  requisicion?: Partial<Requisicion>;
  egreso?: string;
  selected?: boolean;
}
