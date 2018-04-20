import { Sucursal } from './sucursal';
import { VentaDet } from './ventaDet';

export interface Venta {
  id: string;
  fecha: string;
  sucursal: Sucursal;
  cliente: any;
  nombre?: string;
  tipo: string;
  documento: number;
  importe: number;
  descuento: number;
  descuentoOriginal?: number;
  descuentoImporte: number;
  subtotal: number;
  impuesto: number;
  impuestoTasa: number;
  total: number;
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  kilos: number;
  partidas: Array<VentaDet>;
  vale?: boolean;
  clasificacionVale?: string;
  atencion?: string;
  cod?: boolean;
  cargosPorManiobra?: number;
  comisionTarjeta?: number;
  comisionTarjetaImporte?: number;
  corteImporte?: number;
  facturar?: string;
  cuentaPorCobrar?: any;
  cfdiMail?: string;
  usoDeCfdi?: string;
  puesto?: string;
  envio?: any;
  sinExistencia?: false;
  createUser?: string;
  updateUser?: string;
  comentario?: string;
  lastUdated?: string;
  dateCreated?: string;
  statusInfo?: string;
  chequePostFechado?: boolean;
}

export interface TipoDeVenta {
  clave: string;
  descripcion: string;
}
export const TIPOS: TipoDeVenta[] = [
  { clave: 'CON', descripcion: 'Contado' },
  { clave: 'CRE', descripcion: 'Crédito' },
  { clave: 'COD', descripcion: 'Cobro contra entrega' }
];
