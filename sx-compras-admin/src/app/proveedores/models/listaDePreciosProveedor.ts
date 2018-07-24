import { Proveedor } from './proveedor';
import { ListaDePreciosProveedorDet } from './listaDePreciosProveedorDet';

export interface ListaDePreciosProveedor {
  id?: number;
  proveedor: Partial<Proveedor>;
  ejercicio: number;
  mes: number;
  fechaInicial?: string;
  fechaFinal?: string;
  descripcion?: string;
  moneda: string;
  partidas: ListaDePreciosProveedorDet[];
  aplicada?: string;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
  copia?: number;
  selected?: boolean;
}
