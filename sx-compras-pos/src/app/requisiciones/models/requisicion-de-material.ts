import { RequisicionDeMaterialDet } from './requisicion-de-material-det';

export interface RequisicionDeMaterial {
  id: string;
  folio: number;
  proveedor: string;
  rfc?: string;
  clave: string;
  sucursal: string;
  fecha: string;
  comentario: string;
  partidas: Partial<RequisicionDeMaterialDet>;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
