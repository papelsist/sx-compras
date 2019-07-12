export interface NotaDeCargo {
  id?: string;
  cliente: any;
  nombre: string;
  folio?: number;
  tipo: string;
  fecha: string;
  moneda: string;
  tipoDeCambio: number;
  cargo?: number;
  importe: number;
  impuesto: number;
  total: number;
  cobros: number;
  saldo: number;
  partidas?: any[];
  cuentaPorCobrar: any;
  formaDePago?: any;
  usoDeCfdi?: any;
  comentario?: any;
  tipoDeCalculo?: any;
  uuid?: any;
  cfdi?: any;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
