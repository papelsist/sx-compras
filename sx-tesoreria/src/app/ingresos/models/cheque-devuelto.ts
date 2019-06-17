import { Periodo } from 'app/_core/models/periodo';
import { CobroCheque } from './cobro';

export interface ChequeDevuelto {
  id?: string;
  folio?: number;
  numero?: string;
  fecha: string;
  nombre?: string;
  importe?: number;
  cheque: Partial<CobroCheque>;
  cxc?: Object;
  egreso?: Object;
  recepcion?: string;
  comentario?: string;
  creado?: string;
  modificado?: string;
  usuario?: string;
  notaDeCargo?: any;
  cuenta?: string;
}
