export interface Cliente {
  id: string;
  nombre: string;
  clave: string;
  rfc: string;
  credito: LineaDeCredito;
  email?: string;
  permiteCheque?: boolean;
  direccion?: {};
  telefonos?: Array<any>;
  cfdiMail?: string;
  activo?: boolean;
  chequeDevuelto?: number;
}

export interface LineaDeCredito {
  id: string;
  creditoActivo: boolean;
  descuentoFijo: number;
  lineaDeCredito: number;
  plazo: number;
  saldo: number;
  postfechado: boolean;
  socio?: any;
  revision?: boolean;
}
