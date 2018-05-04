import { Sucursal } from 'app/models';

export interface Compra {
  id?: string;
  sucursal: Sucursal;
  proveedor: { id: string; nombre: string };
  folio: number;
  fecha: string;
  entrega?: string;
  comentario?: string;
  pendiente: boolean;
  importeBruto?: number;
  importeDescuento?: number;
  importeNeto?: number;
  impuestos?: number;
  total?: number;
  partidas: any[];
  tipoDeCambio?: number;
  modificado?: string;
}
