import { Proveedor } from './proveedor';
import {
  ListaDePreciosProveedorDet,
  buildPartida
} from './listaDePreciosProveedorDet';
import { Periodo } from '../../_core/models/periodo';
import { ProveedorProducto } from './proveedorProducto';

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

/**
 * Factory function para generar una lista de precios nueva
 *
 * @param proveedor
 * @param moneda
 */
export function buildLista(
  proveedor: Proveedor,
  moneda,
  productos: ProveedorProducto[] = []
): Partial<ListaDePreciosProveedor> {
  const periodo = Periodo.mesActual();
  const partidas: ListaDePreciosProveedorDet[] = productos.map(item =>
    buildPartida(item)
  );
  return {
    proveedor: proveedor,
    ejercicio: periodo.fechaFinal.getFullYear(),
    mes: periodo.fechaInicial.getMonth(),
    fechaInicial: periodo.fechaInicial.toISOString(),
    fechaFinal: periodo.fechaFinal.toISOString(),
    moneda: moneda,
    partidas
  };
}
