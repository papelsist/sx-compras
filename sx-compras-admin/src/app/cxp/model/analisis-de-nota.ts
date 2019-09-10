import { NotaDeCreditoCxP } from './notaDeCreditoCxP';

export interface AnalisisDeNota {
  id: number;
  nota: Partial<NotaDeCreditoCxP>;
  dec: { id: string };
  nombre?: string;
  folio: string;
  serie: string;
  decId: string;
  sucursal: string;
  decFolio: number;
  decFecha: string;
  referencia: string;
  fechaReferencia: string;
  clave: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  costo?: number;
  importe?: number;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
