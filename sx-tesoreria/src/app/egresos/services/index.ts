import { GastosService } from './gastos.service';
import { ComprasService } from './compras.service';
import { ChequesService } from './cheques.service';
import { PagoDeRequisicionService } from './pagoDeRequisicion.service';
import { RembolsoService } from './rembolso.service';
import { CompraMonedaService } from './compra-moneda.service';
import { PagoDeNominaService } from './pago-de-nomina.service';
import { PagoDeMorrallaService } from './pago-morralla.service';

export const services: any[] = [
  GastosService,
  ComprasService,
  ChequesService,
  PagoDeRequisicionService,
  RembolsoService,
  CompraMonedaService,
  PagoDeNominaService,
  PagoDeMorrallaService
];

export * from './gastos.service';
export * from './compras.service';
export * from './cheques.service';
export * from './pagoDeRequisicion.service';
export * from './rembolso.service';
export * from './compra-moneda.service';
export * from './pago-de-nomina.service';
export * from './pago-morralla.service';
