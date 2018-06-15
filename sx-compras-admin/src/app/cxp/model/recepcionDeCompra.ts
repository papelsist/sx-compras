import { RecepcionDeCompraDet } from './recepcionDeCompraDet';

export interface RecepcionDeCompra {
  id: string;
  proveedor: { id: string; nombre: string };
  sucursal: { id: string; nombre: string };
  documento: number;
  remision: string;
  fechaRemision: string;
  selected?: boolean;
  partidas: RecepcionDeCompraDet[];
}
