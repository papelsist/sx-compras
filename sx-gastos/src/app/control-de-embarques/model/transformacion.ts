import { Chofer } from './chofer';

export interface Transformacion {
  id: string;
  sucursal: string;
  tipo: string;
  documento: number;
  fecha: string;
  comentario: string;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
  fechaInventario: string;
  cancelado: string;
  chofer?: Partial<Chofer>;
}
