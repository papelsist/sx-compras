import { ListaDePreciosVentaDet } from './lista-de-precios-venta-det';

export interface ListaDePreciosVenta {
  id: number;
  descripcion: string;
  partidas: Partial<ListaDePreciosVentaDet>[];
  aplicada?: string;
  inicio?: string;
  updateUser?: string;
  createUser?: string;
  lastUpdated?: string;
  dateCreated?: string;
}
