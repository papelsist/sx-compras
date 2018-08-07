import { ProveedorProducto } from './proveedorProducto';

export interface ListaDePreciosProveedorDet {
  id?: number;
  producto: ProveedorProducto;
  clave?: string;
  descripcion?: string;
  unidad?: string;
  moneda?: string;
  precioBruto: number;
  desc1?: number;
  desc2?: number;
  desc3?: number;
  desc4?: number;
  precioNeto?: number;
  precioAnterior?: number;
  direrencia?: number;
}

export function buildPartida(
  prodProv: ProveedorProducto
): ListaDePreciosProveedorDet {
  return {
    producto: prodProv,
    clave: prodProv.clave,
    descripcion: prodProv.descripcion,
    unidad: prodProv.unidad,
    moneda: prodProv.moneda,
    precioAnterior: prodProv.precio,
    precioBruto: prodProv.precioBruto,
    desc1: prodProv.desc1,
    desc2: prodProv.desc2,
    desc3: prodProv.desc3,
    desc4: prodProv.desc4,
    precioNeto: prodProv.precio
  };
}
