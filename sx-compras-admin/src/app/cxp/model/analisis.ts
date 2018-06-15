import { AnalisisDet } from './analisisDet';

export interface Analisis {
  id: string;
  proveedor: { id: string };
  fecha: string;
  factura: { id: string };
  comentario?: string;
  importe: number;
  partidas: AnalisisDet[];
  selected?: boolean;
}
