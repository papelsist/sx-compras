import { Sucursal } from 'app/models';
import { CompraDet } from './compraDet';
import { Proveedor } from '../../proveedores/models/proveedor';
import { Periodo } from '../../_core/models/periodo';

export interface Compra {
  id?: string;
  sucursal: Sucursal;
  sucursalNombre?: string;
  proveedor: { id: string; nombre: string };
  nombre?: string;
  folio: number;
  serie?: string;
  fecha: string;
  entrega?: string;
  comentario?: string;
  pendiente: boolean;
  importeBruto?: number;
  importeDescuento?: number;
  importeNeto?: number;
  impuestos?: number;
  total?: number;
  partidas: CompraDet[];
  moneda: string;
  tipoDeCambio?: number;
  modificada?: string;
  selected?: boolean;
  createdBy?: string;
  lastUpdatedBy?: string;
  status?: string;
  cerrada?: string;
  email?: string;
  ultimaDepuracion?: string;
}
export interface ComprasFilter {
  fechaInicial?: Date;
  fechaFinal?: Date;
  proveedor?: Partial<Proveedor>;
  registros?: number;
  pendientes?: boolean;
  folio?: number;
}

export function buildFilter(registros: number = 50): ComprasFilter {
  const periodo = Periodo.fromNow(30);
  return {
    fechaInicial: periodo.fechaInicial,
    fechaFinal: periodo.fechaFinal,
    registros,
    pendientes: true
  };
}
