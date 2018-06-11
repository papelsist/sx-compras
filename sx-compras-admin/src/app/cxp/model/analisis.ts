import { AnalisisDet } from './analisisDet';

export interface Analisis {
  id: string;
  proveedor: { id: string };
  partidas: AnalisisDet[];
}
