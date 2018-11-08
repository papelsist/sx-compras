import { Traspaso } from './traspaso';

export interface Inversion extends Traspaso {
  rendimientoReal: number;
  rendimientoCalculado: number;
  tasa: number;
  plazo: number;
  vencimiento: string;
  isr: number;
  isrImporte: number;
  rendimientoFecha: string;
  rendimientoImpuesto?: number;
}
