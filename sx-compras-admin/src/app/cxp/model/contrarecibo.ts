import { CuentaPorPagar } from './cuentaPorPagar';
import { Proveedor } from '../../proveedores/models/proveedor';

export interface Contrarecibo {
  id?: number;
  proveedor: Partial<Proveedor>;
  nombre: string;
  partidas?: Partial<CuentaPorPagar>[];
  fecha: string;
  total: number;
  comentario?: string;
  createUser?: string;
  updateUser?: string;
  creado?: string;
  modificado?: string;
  selected?: boolean;
}
