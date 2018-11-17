export interface CortesPorSucursal {
  sucursal: { id: string; nombre: string };
  fecha: string;
  cobros: Array<any>;
}
