import { AnalisisDeTransformacion } from './analisis-de-transformacion';

export interface AnalisisDeTransformacionDet {
  id: number;
  analisis: Partial<AnalisisDeTransformacion>;
  clave: string;
  descripcion: string;
  unidad: string;
  trs: Partial<any>;
  cantidad: number;
  costo: number;
  importe: number;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
