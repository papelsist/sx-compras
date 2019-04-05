import { FacturistaDeEmbarque } from './facturista-de-embarque';

export interface FacturistaCargo {
  id: number;
  facturista: Partial<FacturistaDeEmbarque>;
  tipo: string;
  nombre: string;
  fecha: string;
  importe: number;
  comentario: string;
  cxc?: Object;
  createUser?: string;
  updateUser?: string;
  dateCreated?: string;
  lastUpdated?: string;
}
