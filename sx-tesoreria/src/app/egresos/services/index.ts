import { GastosService } from './gastos.service';
import { ComprasService } from './compras.service';
import { ChequesService } from './cheques.service';
import { PagoDeRequisicionService } from './pagoDeRequisicion.service';
import { RembolsoService } from './rembolso.service';

export const services: any[] = [
  GastosService,
  ComprasService,
  ChequesService,
  PagoDeRequisicionService,
  RembolsoService
];

export * from './gastos.service';
export * from './compras.service';
export * from './cheques.service';
export * from './pagoDeRequisicion.service';
export * from './rembolso.service';
