import { FacturistaDeEmbarque } from './facturista-de-embarque';

export interface FacturistaEstadoDeCuenta {
  id: number;
  facturista: Partial<FacturistaDeEmbarque>;
  nombre: string;
  fecha: string;
  tipo: string;
  origen: string;
  concepto: string;
  importe: number;
  saldo: number;
  tasaDeInteres: number;
  comentario: string;
  createUser?: string;
  updateUser?: string;
  dateCreated?: string;
  lastUpdated?: string;
}
