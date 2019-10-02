import { Proveedor } from 'app/proveedores/models/proveedor';
import { CuentaPorPagar } from './cuentaPorPagar';
import { AnalisisDeTransformacionDet } from './analisis-de-transformaciondet';

export interface AnalisisDeTransformacion {
  id: number;
  proveedor: Partial<Proveedor>;
  nombre: string;
  fecha: string;
  cxp: Partial<CuentaPorPagar>;
  uuid: string;
  analizado?: number;
  total?: number;
  comentario: string;
  cerrada?: string;
  partidas: AnalisisDeTransformacionDet[];
  dateCreated: string;
  lastUpdated: string;
  createUser?: string;
  updateUser?: string;
}
