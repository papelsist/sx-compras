import { RecepcionDeCompraDet } from './recepcionDeCompraDet';

export interface AnalisisDet {
  id: string;
  com: Partial<RecepcionDeCompraDet>;
  clave: string;
  descripcion: string;
  cantidad: number;
  precioDeLista: number;
  desc1: number;
  desc2: number;
  desc3: number;
  desc4: number;
  costoUnitario: number;
  importe: number;
  remision: string;
  folioCom: number;
  sucursal: string;
}

export function buildFromCom(com: RecepcionDeCompraDet): Partial<AnalisisDet> {
  const { id, cantidad, producto } = com;
  return {
    com: { id, cantidad, producto },
    clave: com.producto.clave,
    descripcion: com.producto.descripcion,
    cantidad: com.cantidad - com.analizado,
    sucursal: com.sucursal,
    folioCom: com.com,
    remision: com.remision,
    precioDeLista: 0.0,
    desc1: 0.0,
    desc2: 0.0,
    desc3: 0.0,
    desc4: 0.0,
    costoUnitario: 0.0,
    importe: 0.0
  };
}
