import { Sucursal } from 'app/models';
import { OrdenDeCompraDet } from './orden-de-compra-det';
import { Proveedor } from 'app/proveedores/models/proveedor';

export interface OrdenDeCompra {
  id?: string;
  sucursal: Partial<Sucursal>;
  sucursalNombre?: string;
  proveedor: Partial<Proveedor>;
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
  partidas: Partial<OrdenDeCompraDet>[];
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
  pendientes?: number;
}
