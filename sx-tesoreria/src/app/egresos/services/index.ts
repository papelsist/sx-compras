import { GastosService } from './gastos.service';
import { ComprasService } from './compras.service';
import { ChequesService } from './cheques.service';

export const services: any[] = [GastosService, ComprasService, ChequesService];

export * from './gastos.service';
export * from './compras.service';
export * from './cheques.service';
