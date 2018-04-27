import { Sucursal, Producto } from '.';

export interface Existencia {
  id: string;
  sucursal: Sucursal;
  producto: Producto;
  anio: number;
  mes: number;
  nacional: boolean;
  kilos: number;
  pedidosPendiente?: number;
  entradaCompra?: number;
  devolucionCompra?: number;
  venta?: number;
  devolucionVenta?: number;
  movimientoAlmacen?: number;
  traslado?: number;
  transformacion?: number;
  cantidad?: number;
  recorte?: number;
  recorteComentario?: string;
  recorteFecha?: string;
  disponible: number;
}
