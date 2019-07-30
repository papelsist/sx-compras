import { CambioDePrecioDet } from './cambio-de-precio-det';

export interface CambioDePrecio {
  id: string;
  partidas: Partial<CambioDePrecioDet>[];
  comentario: string;
}
