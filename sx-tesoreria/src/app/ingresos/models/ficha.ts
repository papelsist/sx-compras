import * as moment from 'moment';
import { Sucursal } from 'app/models';

export interface Ficha {
  id?: string;
  folio: number;
  sucursal: { id: string; nombre: string };
  origen: string;
  fecha: string;
  cheque: number;
  efectivo: number;
  total: number;
  cuentaDeBanco: any;
  tipoDeFicha: string;
  fechaCorte: string;
  cancelada: string;
  comentario: string;
  tipo: string;
  creado?: string;
  modificado?: string;
  usuario?: string;
  ingreso?: any;
}

export class FichaFilter {
  fecha: Date;
  tipo: string;
  sucursal: Sucursal;
}

export function buildFichasFilter(): FichaFilter {
  return {
    fecha: moment()
      .subtract(2, 'days')
      .toDate(),
    tipo: 'CRE',
    sucursal: undefined
  };
}

export interface FichaBuildCommand {
  fecha: string;
  formaDePago: string;
  tipo: string;
  cuenta: string;
}
