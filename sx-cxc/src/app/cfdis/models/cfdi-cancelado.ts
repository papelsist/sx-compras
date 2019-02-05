import { Cfdi } from './cfdi';

export interface CfdiCancelado {
  id: string;
  uuid: string;
  serie: string;
  folio: string;
  comentario: string;
  ack: any;
  status: string;
  statusCode: string;
  isCancelable: string;
  cancelStatus: string;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
  cfdi: Partial<Cfdi>;
}
