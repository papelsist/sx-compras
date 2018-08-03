import { Proveedor } from '../../proveedores/models/proveedor';
import { ComprobanteFiscal } from './comprobanteFiscal';
import { NotaDeCreditoCxPDet } from './notaDeCreditoCxPDet';

export interface NotaDeCreditoCxP {
  id: string;
  fecha: string;
  proveedor: Partial<Proveedor>;
  nombre?: string;
  folio?: string;
  serie?: string;
  uuid?: string;
  moneda: string;
  tipoDeCambio: number;
  subTotal: number;
  descuento: number;
  impuestoTrasladado: number;
  impuestoRetenido: number;
  total: number;
  comentario?: string;
  conceptos?: NotaDeCreditoCxPDet[];
  creado: string;
  modificado: string;
  concepto: string;
  comprobanteFiscal: Partial<ComprobanteFiscal>;
}
