import { CuentaPorCobrar } from './cuentaPorCobrar';

export interface NotaDeCreditoDet {
  id?: string;
  cuentaPorCobrar?: Partial<CuentaPorCobrar>;
  base: number;
  impuesto: number;
  importe: number;
  documento: number;
  tipoDeDocumento: string;
  fechaDocumento: string;
  totalDocumento: number;
  saldoDocumento: number;
  sucursal: string;
  comentario: string;
}

export function buildNotaDet(cxc: CuentaPorCobrar): Partial<NotaDeCreditoDet> {
  const det = {
    cuentaPorCobrar: cxc,
    documento: cxc.documento,
    tipoDeDocumento: cxc.tipoDocumento,
    totalDocumento: cxc.total,
    saldoDocumento: cxc.saldoReal,
    fechaDocumento: cxc.fecha,
    sucursal: cxc.sucursalNombre,
    importe: cxc.saldoReal
  };
  return det;
}
