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
  pagosDocumento: number;
  saldoDocumento: number;
  uuid?: string;
  sucursal: string;
  comentario: string;
}

export function buildNotaDet(cxc: CuentaPorCobrar): Partial<NotaDeCreditoDet> {
  const det: Partial<NotaDeCreditoDet> = {
    cuentaPorCobrar: { id: cxc.id },
    documento: cxc.documento,
    tipoDeDocumento: cxc.tipo,
    totalDocumento: cxc.total,
    pagosDocumento: cxc.pagos,
    saldoDocumento: cxc.saldoReal,
    fechaDocumento: cxc.fecha,
    sucursal: cxc.sucursalNombre,
    importe: cxc.saldoReal,
    uuid: cxc.uuid
  };
  return det;
}
