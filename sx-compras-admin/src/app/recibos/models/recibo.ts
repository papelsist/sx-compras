import { ReciboDet } from './recibo-det';

export interface Recibo {
  id: number;
  partidas: Partial<ReciboDet[]>;
  fecha: string;
  serie?: string;
  folio?: string;
  emisor: string;
  emisorRfc: string;
  receptor: string;
  receptorRfc: string;
  cfdi: { id: string };
  uuid: string;
  validacionFacturas: string;
  validacionPago: string;
  numOperacion: string;
  formaDePagoP: string;
  monto: number;
  fechaPago: string;
  monedaP: string;
  requisicion: string;
  createUser: string;
  updateUser: string;
  dateCreated: string;
  lastUpdated: string;
  revision?: string;
}
