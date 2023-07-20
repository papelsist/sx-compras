import { Linea } from './linea';
import { Clase } from './clase';
import { Marca } from './marca';
import { Proveedor } from '../../proveedores/models/proveedor';
import { ClasificacionEcommerce } from './clasificacionEcommerce';

export interface Producto {
  id?: string;
  clave?: string;
  descripcion: string;
  linea: Linea;
  marca: Marca;
  clase: Clase;
  unidad: string;
  activo: boolean;
  ajuste: number;
  ancho: number;
  calibre: number;
  caras: number;
  deLinea: boolean;
  gramos: number;
  inventariable: boolean;
  kilos: number;
  largo: number;
  m2XMillar: number;
  modoVenta: string;
  nacional: boolean;
  precioContado: number;
  precioCredito: number;
  precioTarjeta: number;
  presentacion: string;
  lastUpdated?: string;
  selected?: boolean;
  proveedorFavorito?: Partial<Proveedor>;
  clasificacionEcommerce?: ClasificacionEcommerce;
}
