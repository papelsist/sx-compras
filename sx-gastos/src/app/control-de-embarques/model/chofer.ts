import { FacturistaDeEmbarque } from './facturista-de-embarque';

export interface Chofer {
  id: string;
  nombre: string;
  rfc: string;
  celular?: string;
  mail?: string;
  sw2?: string;
  facturista: Partial<FacturistaDeEmbarque>;
  comision: number;
  precioTonelada?: number;
  dateCreated?: string;
  lastUpdated?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
}
