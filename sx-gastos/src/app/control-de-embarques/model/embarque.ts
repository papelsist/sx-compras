import { Sucursal } from 'app/models';
import { Chofer } from './chofer';
import { Envio } from './envio';

export interface Embarque {
  id: string;
  sucursal: Partial<Sucursal>;
  documento: number;
  fecha: string;
  cerrado: string;
  chofer: Partial<Chofer>;
  kilos: number;
  regreso: string;
  salida: string;
  valor: number;
  partidas: Envio[];
  empleado?: string;
  comentario?: string;
  dateCreated?: string;
  createUser?: string;
  updateUser?: string;
}
