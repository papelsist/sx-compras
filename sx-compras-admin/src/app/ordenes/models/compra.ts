import { Sucursal, Proveedor } from 'app/models';

export interface Compra {
  id?: string;
  sucursal: Sucursal;
  proveedor: Proveedor;
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
