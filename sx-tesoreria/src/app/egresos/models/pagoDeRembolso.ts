import { Rembolso } from './rembolso';

export interface PagoDeRembolso {
  rembolso: Rembolso;
  cuenta: string;
  referencia: string;
  importe?: number;
}
