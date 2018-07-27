import { Compra } from './compra';
import { Producto } from '../../productos/models/producto';
import { ProveedorProducto } from '../../proveedores/models/proveedorProducto';

export interface CompraDet {
  id?: string;
  compra: { id: string };
  producto: Partial<Producto>;
  sucursal?: { id: string; nombre: string };
  solicitado: number;
  precio: number;
  descuento1: number;
  descuento2: number;
  descuento3: number;
  descuento4: number;
  costo: number;
  importeBruto: number;
  importeNeto: number;
  depuracion?: string;
  depurado: number;
  recibido: number;
  porRecibir: number;
  comentario: string;
  selected?: boolean;
}

export function buildCompraDet(
  provProd: ProveedorProducto
): Partial<CompraDet> {
  return {
    producto: provProd.producto,
    solicitado: 0,
    precio: provProd.precioBruto,
    descuento1: provProd.desc1,
    descuento2: provProd.desc2,
    descuento3: provProd.desc3,
    descuento4: provProd.desc4,
    costo: provProd.precio,
    importeBruto: 0,
    importeNeto: 0
  };
}
