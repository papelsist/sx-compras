import { Producto } from '../../productos/models/producto';

export interface RecepcionDeCompraDet {
  id: string;
  inventario: { id: string };
  compraDet: { id: string };
  producto: Producto;
  cantidad: number;
  devuelto: number;
  kilos: number;
  comentario?: string;
  sucursal: string;
  com: number;
  remision: string;
}
