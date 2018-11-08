import { CuentaDeBanco } from 'app/models';

export interface Traspaso {
  id?: number;
  cuentaOrigen: Partial<CuentaDeBanco>;
  origen?: string;
  cuentaDestino: Partial<CuentaDeBanco>;
  destino?: string;
  fecha: string;
  moneda: string;
  importe: number;
  comision: number;
  impuesto: number;
  comentario?: string;
  referencia?: string;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
  movimientos: Object[];
}

export class TraspasosFilter {
  fechaInicial?: Date;
  fechaFinal?: Date;
  cuenta?: CuentaDeBanco;
  registros?: number;
}
