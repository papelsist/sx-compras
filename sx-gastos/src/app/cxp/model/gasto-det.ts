import { CuentaPorPagar } from './cuentaPorPagar';

export interface GastoDet {
  id: number;
  cxp: Partial<CuentaPorPagar>;
  cuentaContable: any;
  sucursal: any;
  sucursalNombre: string;
  descripcion: string;
  comentario: string;
  activoFijo: boolean;
  cfdiDet: string;
  cfdiUnidad: string;
  cfdiDescripcion: string;
  cantidad: number;
  valorUnitario: number;
  importe: number;
  descuento: number;
  isrRetenido: number;
  isrRetenidoTasa: number;
  ivaRetenido: number;
  ivaRetenidoTasa: number;
  ivaTrasladado: number;
  ivaTrasladadoTasa: number;
  modelo: string;
  serie: string;
  // Fletes
  facturistaPrestamo: number;
  facturistaVales: number;
  facturistaCargos: number;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}
