import { ListaDePreciosVentaDet } from './lista-de-precios-venta-det';

export interface ListaDePreciosVenta {
  id: number;
  comentario: string;
  partidas: Partial<ListaDePreciosVentaDet>[];
}
