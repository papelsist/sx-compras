import { CobroService } from './cobro.service';
import { ChequeDevueltoService } from './cheque-devuelto.service';
import { FichasService } from './ficha.service';

export const services: any[] = [
  CobroService,
  ChequeDevueltoService,
  FichasService
];

export * from './cobro.service';
export * from './cheque-devuelto.service';
export * from './ficha.service';
