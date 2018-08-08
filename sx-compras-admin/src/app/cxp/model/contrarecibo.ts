import { CuentaPorPagar } from './cuentaPorPagar';

export interface Contrarecibo {
  id?: number;
  proveedor: { id: string };
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
