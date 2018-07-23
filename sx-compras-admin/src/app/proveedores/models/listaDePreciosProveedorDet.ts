import { ProveedorProducto } from './proveedorProducto';

export interface ListaDePreciosProveedorDet {
  id?: number;
  producto: ProveedorProducto;
  clave?: string;
  descripcion?: string;
  unidad?: string;
  precioBruto: number;
  desc1?: number;
  desc2?: number;
  desc3?: number;
  desc4?: number;
  precioNeto?: number;
  precioAnterior?: number;
}

export function buildPartida(
  prodProv: ProveedorProducto
): ListaDePreciosProveedorDet {
  return {
    producto: prodProv,
    clave: prodProv.clave,
    descripcion: prodProv.descripcion,
    unidad: prodProv.unidad,
    precioAnterior: prodProv.precio,
    precioBruto: prodProv.precio,
    desc1: 0.0,
    desc2: 0.0,
    desc3: 0.0,
    desc4: 0.0,
    precioNeto: 0.0
  };
}
