import { Sucursal } from './sucursal';
import { Producto } from './producto';

export interface VentaDet {
  id?: string;
  sucursal: Sucursal;
  producto: Producto;
  // Manejo de importes
  cantidad: number;
  precio: number;
  importe: number;
  descuento: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  // End importes
  nacional?: boolean;
  kilos?: number;
  comentario?: string;
  conVale?: boolean;
  importeCortes?: number;
  corte?: any;
  sinExistencia?: false;
  precioLista: number;
  precioOriginal: number;
  descuentoOriginal: number;
  dateCreated?: string;
  lastUpdated?: string;
  devuelto?: number;
  disponibleParaDevolucion?: number;
  enviado?: number;
}
