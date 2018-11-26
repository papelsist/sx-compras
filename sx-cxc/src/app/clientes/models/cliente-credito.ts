import { Cobrador } from './cobrador';

export interface ClienteCredito {
  id: string;
  creditoActivo: boolean;
  descuentoFijo: number;
  lineaDeCredito: number;
  plazo: number;
  venceFactura: boolean;
  diaRevision: number;
  diaCobro: number;
  revision?: boolean;
  saldo: number;
  atrasoMaximo: number;
  postfechado: boolean;
  operador: number;
  cobrador: Partial<Cobrador>;
  socio?: any;
}
