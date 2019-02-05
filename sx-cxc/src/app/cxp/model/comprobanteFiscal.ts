import { Proveedor } from '../../proveedores/models/proveedor';
import { Periodo } from '../../_core/models/periodo';
import { ComprobanteFiscalConcepto } from './comprobanteFiscalConcepto';

export interface ComprobanteFiscal {
  id: string;
  fileName: string;
  tipo: string;
  serie: string;
  folio: string;
  fecha: string;
  proveedor: { id: string };
  emisorNombre: string;
  emisorRfc: string;
  receptorNombre: string;
  receptorRfc: string;
  tipoDeComprobante: string;
  uuid: string;
  metodoDePago: string;
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  total: number;
  comentario: string;
  analizado: boolean;
  pdf: boolean;
  xml: boolean;
  selected?: boolean;
  versionCfdi: string;
  conceptos?: ComprobanteFiscalConcepto[];
}

export class CfdisFilter {
  fechaInicial: Date;
  fechaFinal: Date;
  proveedor?: Partial<Proveedor>;
  registros: number;
}

export function createDefaultFilter(): CfdisFilter {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(30);
  const registros = 100;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}
