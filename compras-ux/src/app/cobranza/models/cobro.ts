export interface Cobro {
  id?: string;
  cliente: { id: string; nombre: string };
  nombre?: string;
  sucursal: { id: string; nombre: string };
  tipo: string;
  fecha: string;
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  importe: number;
  diferencia: number;
  disponible: number;
  referencia?: string;
  primeraAplicacion?: string;
  anticipo?: boolean;
  enviado?: boolean;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
  aplicaciones?: Array<any>;
  tarjeta?: CobroTarjeta;
  cheque?: CobroCheque;
  porAplicar?: number;
  aplicado?: number;
  comentario?: string;
  pendientesDeAplicar?: Array<any>;
  bancoOrigen?: string;
  selected?: boolean;
  saldo?: number;
  recibo?: string;
}

export interface CobroTarjeta {
  id?: string;
  debitoCredito: boolean;
  visaMaster: boolean;
  validacion: number;
}

export interface CobroCheque {
  id?: string;
  importe?: number;
  fecha?: string;
  nombre?: string;
  primeraAplicacion?: string;
  banco: { id: string };
  numero: string;
  numeroDeCuenta: string;
  selected?: boolean;
}
