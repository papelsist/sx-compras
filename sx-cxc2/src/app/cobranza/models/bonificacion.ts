import { NotaDeCredito } from './nota-de-credito';

export interface Bonificacion extends NotaDeCredito {
  tipoDeCalculo: 'PORCENTAJE' | 'PRORRATEO';
  baseDelCalculo: 'Saldo' | 'Importe';
}
