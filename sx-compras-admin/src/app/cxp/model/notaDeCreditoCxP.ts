import { Proveedor } from '../../proveedores/models/proveedor';
import { ComprobanteFiscal } from './comprobanteFiscal';
import { NotaDeCreditoCxPDet } from './notaDeCreditoCxPDet';
import { AplicacionDePago } from './aplicacionDePago';

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
  tcContable?: number;
  subTotal: number;
  descuento: number;
  impuestoTrasladado: number;
  impuestoRetenido: number;
  total: number;
  aplicado?: number;
  disponible: number;
  comentario?: string;
  conceptos?: NotaDeCreditoCxPDet[];
  creado: string;
  modificado: string;
  concepto: string;
  tipoDeRelacion?: string;
  comprobanteFiscal: Partial<ComprobanteFiscal>;
  aplicaciones: Partial<AplicacionDePago>[];
  selected?: boolean;
}
