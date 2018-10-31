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
}

export class FichaFilter {
  fecha: Date;
  tipo: string;
  sucursal: string;
}

export function buildFichasFilter(): FichaFilter {
  return {
    fecha: new Date(),
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
