import { Producto } from 'app/productos/models/producto';
import { Proveedor } from './proveedor';

export interface ProveedorProducto {
  id?: string;
  proveedor: Partial<Proveedor>;
  producto: Partial<Producto>;
  clave?: string;
  descripcion?: string;
  unidad?: string;
  claveProveedor: string;
  codigoProveedor: string;
  descripcionProveedor: string;
  paqueteTarima: number;
  piezaPaquete: number;
  moneda: string;
  precioBruto: number;
  desc1: number;
  desc2: number;
  desc3: number;
  desc4: number;
  precio: number;
  fecha: string;
  createUser: string;
  updateUser: string;
  creado?: string;
  modificado?: string;
  suspendido?: boolean;
  selected?: boolean;
}

export function buildFrom(producto: Producto): Partial<ProveedorProducto> {
  return {
    producto: producto,
    claveProveedor: '',
    codigoProveedor: '',
    descripcionProveedor: '',
    clave: producto.clave,
    descripcion: producto.descripcion,
    unidad: producto.unidad,
    paqueteTarima: 0,
    piezaPaquete: 0,
    precioBruto: 0.0,
    desc1: 0.0,
    desc2: 0.0,
    desc3: 0.0,
    desc4: 0.0,
    precio: 0.0
  };
}
