import { FacturistaDeEmbarque } from './facturista-de-embarque';

export interface FacturistaPrestamo {
  id: number;
  facturista: Partial<FacturistaDeEmbarque>;
  tipo: string;
  nombre: string;
  fecha: string;
  autorizacion: string;
  autorizo: string;
  importe: number;
  comentario: string;
  egreso?: Object;
  cxc?: Object;
  createUser?: string;
  updateUser?: string;
  dateCreated?: string;
  lastUpdated?: string;
}
