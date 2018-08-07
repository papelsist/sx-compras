import { NotaDeCreditoCxP } from './notaDeCreditoCxP';
import { CuentaPorPagar } from './cuentaPorPagar';

export interface AplicacionDePago {
  id?: string;
  fecha: string;
  formaDePago: string;
  nota?: Partial<NotaDeCreditoCxP>;
  cxp?: Partial<CuentaPorPagar>;
  importe: number;
  comentario?: string;
}
