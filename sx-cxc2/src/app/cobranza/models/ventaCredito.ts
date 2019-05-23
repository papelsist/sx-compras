export interface VentaCredito {
  id: string;
  cliente: string;
  nombre: string;
  cuentaPorCobrar: Object;
  plazo: number;
  vencimientoFactura: boolean;
  vencimiento: string;
  fechaRecepcionCxc: string;
  diaRevision: number;
  fechaRevision: string;
  fechaRevisionCxc: string;
  descuento: number;
  revision: boolean;
  revisada: boolean;
  diaPago: number;
  fechaPago: string;
  reprogramarPago: string;
  cobrador: Object;
  socio?: any;
  operador: number;
  comentario?: string;
  comentarioReprogramarPago: string;
}
