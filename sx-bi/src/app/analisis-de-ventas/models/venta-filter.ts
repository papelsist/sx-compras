export interface VentaFilter {
  fechaInicial: Date;
  fechaFinal: Date;
  clasificacion: Clasificacion;
  tipoVenta: string;
  tipo: string;
}

export enum Clasificacion {
  LINEA = 'LINEA',
  CLIENTE = 'CLIENTE',
  PRODUCTO = 'PRODUCTO',
  SUCURSAL = 'SUCURSAL',
  VENTA = 'VENTA',
  MES = 'MES'
}
