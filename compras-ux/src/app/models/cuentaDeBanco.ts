export interface CuentaDeBanco {
  id: string;
  numero: string;
  clave: string;
  descripcion: string;
  disponibleEnPagos: boolean;
  disponibleEnVentas: boolean;
}
