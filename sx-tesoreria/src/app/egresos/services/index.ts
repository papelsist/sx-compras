import { GastosService } from './gastos.service';
import { ComprasService } from './compras.service';
import { ChequesService } from './cheques.service';
import { PagoDeRequisicionService } from './pagoDeRequisicion.service';

export const services: any[] = [
  GastosService,
  ComprasService,
  ChequesService,
  PagoDeRequisicionService
];

export * from './gastos.service';
export * from './compras.service';
export * from './cheques.service';
export * from './pagoDeRequisicion.service';
