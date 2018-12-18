import { Periodo } from 'app/_core/models/periodo';

export interface Cfdi {
  id: string;
  versionCfdi: string;
  fecha: string;
  serie: string;
  folio: string;
  emisor: string;
  emisorRfc: string;
  receptor: string;
  receptorRfc: string;
  tipoDeComprobante: string;
  fileName: string;
  uuid: string;
  total: number;
  moneda: string;
  url: string;
  sw2?: string;
  timbre: Object;
  origen: string;
  cancelado: boolean;
  status?: string;
  email?: string;
  enviado?: string;
  comentario: string;
  dateCreated: string;
  lastUpdated: string;
  createUser?: string;
  updateUser?: string;
}

export class CfdisFilter {
  fechaInicial: Date;
  fechaFinal: Date;
  receptor?: string;
  registros: number;
}

export function createDefaultFilter(): CfdisFilter {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(5);
  const registros = 100;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}
