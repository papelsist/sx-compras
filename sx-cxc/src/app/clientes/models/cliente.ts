import { ClienteCredito } from './cliente-credito';

export interface Cliente {
  id?: string;
  nombre: string;
  clave: string;
  rfc: string;
  credito: Partial<ClienteCredito>;
  permiteCheque?: boolean;
  direccion?: {};
  telefonos?: Array<any>;
  cfdiMail?: string;
  activo?: boolean;
  chequeDevuelto?: number;
  cfdiMailValidado?: boolean;
}
