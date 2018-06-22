export interface CuentaPorPagar {
  id: string;
  nombre: string;
  tipo: string;
  folio: string;
  uuid: string;
  serie: string;
  fecha: string;
  subTotal: number;
  descuento: number;
  impuestoTrasladado: number;
  impuestoRetenido: number;
  total: number;
  vencimiento: string;
  selected?: boolean;
  comprobanteFiscal: { id: string };
}
