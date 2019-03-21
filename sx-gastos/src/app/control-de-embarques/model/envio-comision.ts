import { Chofer } from './chofer';
import { Envio } from './envio';
import { Sucursal } from 'app/models';
import { Periodo } from 'app/_core/models/periodo';

export interface EnvioComision {
  id: number;
  chofer: Partial<Chofer>;
  nombre: string;
  envio: Partial<Envio>;
  traslado: any;
  fechaComision: string;
  valor: number;
  kilos: number;
  comentarioDeComision: string;
  comisionPorTonelada: number;
  importeComision: number;
  comision: number;
  precioTonelada: number;
  maniobra: number;
  regreso: string;
  sucursal: string;
  entidad?: string;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}

export class EnviosFilter {
  sucursal?: Partial<Sucursal>;
  fechaInicial?: Date;
  fechaFinal?: Date;
  registros?: number;
}

export function createEnviosFilter() {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(15);
  const registros = 300;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}

export function saveInLocalStorage(filter: EnviosFilter) {
  const periodo = new Periodo(filter.fechaInicial, filter.fechaFinal);
  Periodo.saveOnStorage('sx.comisionEnvio.periodo', periodo);
  const data = { registros: filter.registros, sucursal: filter.sucursal };
  localStorage.setItem('sx.comisionEnvio.registros', JSON.stringify(data));
}
export function readFromLocalStorage(): EnviosFilter {
  const periodo = Periodo.fromStorage(
    'sx.comisionEnvio.periodo',
    Periodo.fromNow(15)
  );
  const data = JSON.parse(
    localStorage.getItem('sx.comisionEnvio.registros')
  ) || { registros: 3000 };
  return {
    ...periodo,
    ...data
  };
}
