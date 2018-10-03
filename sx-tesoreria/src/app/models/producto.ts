export interface Producto {
  id?: string;
  clave?: string;
  descripcion: string;
  linea?: string;
  marca?: string;
  clase?: string;
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
  presentacion: string;
  lastUpdated?: string;
  selected?: boolean;
}
