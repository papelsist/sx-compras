import { RecepcionDeCompraDet } from './recepcionDeCompraDet';

export interface AnalisisDet {
  id: string;
  com: Partial<RecepcionDeCompraDet>;
  cantidad: number;
  precioDeLista: number;
  desc1: number;
  desc2: number;
  desc3: number;
  desc4: number;
  costoUnitario: number;
  importe: number;
}

export function buildFromCom(com: RecepcionDeCompraDet): Partial<AnalisisDet> {
  const { id, cantidad, producto } = com;
  return {
    com: { id, cantidad, producto },
    cantidad: com.cantidad,
    precioDeLista: 0.0,
    desc1: 0.0,
    desc2: 0.0,
    desc3: 0.0,
    desc4: 0.0,
    costoUnitario: 0.0,
    importe: 0.0
  };
}
