import { Sucursal } from 'app/models';
import { Movimiento } from 'app/cuentas/models/movimiento';

export interface Morralla {
  id: string;
  sucursal: Partial<Sucursal>;
  fecha: string;
  tipo: string;
  importe: number;
  comentario?: string;
  selected?: boolean;
}
