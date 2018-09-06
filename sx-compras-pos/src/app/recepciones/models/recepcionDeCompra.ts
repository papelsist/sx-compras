import { RecepcionDeCompraDet } from './recepcionDeCompraDet';
import { Compra } from '../../ordenes/models/compra';

export interface RecepcionDeCompra {
  id?: string;
  nombre?: string;
  sucursalNombre?: string;
  documento?: number;
  remision?: string;
  fechaRemision?: string;
  compra: { id: string };
  proveedor: { id: string };
  sucursal: { id: string };
  fecha?: string;
  comentario?: string;
  partidas: Partial<RecepcionDeCompraDet>[];
  creado?: string;
  modificado?: string;
  createUser?: string;
  updateUser?: string;
  fechaInventario?: string;
  cancelado?: string;
  compraFolio?: number;
  compraFecha?: string;
}

export function buildRecepcion(compra: Compra): Partial<RecepcionDeCompra> {
  return {
    nombre: compra.nombre,
    compra: { id: compra.id },
    proveedor: { id: compra.proveedor.id }
  };
}
