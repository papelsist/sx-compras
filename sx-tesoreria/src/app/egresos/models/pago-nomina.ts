import { Movimiento } from 'app/cuentas/models/movimiento';

export interface PagoDeNomina {
  id: number;
  nomina: number;
  folio: number;
  tipo: string;
  periodicidad: string;
  formaDePago: string;
  total: number;
  pago: string;
  ejercicio: number;
  mes: number;
  fechaInicial: string;
  fechaFinal: string;
  numeroDeEmpleado: number;
  nominaEmpleado: number;
  empleadoId: number;
  afavor: string;
  empleado: string;
  pensionAlimenticia: boolean;
  egreso: Partial<Movimiento>;
  dateCreated: string;
  lastUpdated: string;
  createUser: string;
  updateUser: string;
}

export interface PagoDeNominaCommand {
  pagoDeNomina: number;
  cuenta: string;
  referencia: string;
  importe?: number;
}
