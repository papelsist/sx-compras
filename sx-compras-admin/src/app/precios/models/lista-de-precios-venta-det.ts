import { Producto } from 'app/productos/models/producto';
import { Proveedor } from 'app/proveedores/models/proveedor';

export interface ListaDePreciosVentaDet {
  id: number;
  producto: Partial<Producto>;
  clave: string;
  descripcion: string;
  linea: string;
  marca?: string;
  clase?: string;
  precioContado: number;
  precioCredito: number;
  precioAnteriorContado: number;
  precioAnteriorCredito: number;
  costo: number;
  costoUltimo: number;
  incremento: number;
  factorContado: number;
  factorCredito: number;
  proveedor: Partial<Proveedor>;
}

export function createPartida(producto: any): Partial<ListaDePreciosVentaDet> {
  const {
    clave,
    descripcion,
    linea,
    marca,
    clase,
    precioContado,
    precioCredito
  } = producto;
  return {
    clave,
    descripcion,
    linea,
    marca,
    clase,
    precioAnteriorContado: precioContado,
    precioAnteriorCredito: precioCredito
  };
}
