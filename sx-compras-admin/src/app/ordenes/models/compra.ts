import { Sucursal } from 'app/models';
import { CompraDet } from './compraDet';

export interface Compra {
  id?: string;
  sucursal: Sucursal;
  sucursalNombre?: string;
  proveedor: { id: string; nombre: string };
  nombre?: string;
  folio: number;
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
  createUser?: string;
  updateUser?: string;
  status?: string;
}
