import { Periodo } from 'app/_core/models/periodo';

import * as moment from 'moment';

export class CarteraFilter {
  fechaInicial?: Date;
  fechaFinal?: Date;
  nombre?: string;
  registros?: number;
}

export function buildCarteraFilter(): CarteraFilter {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(20);
  const registros = 100;
  return {
    fechaInicial,
    fechaFinal,
    registros
  };
}

export function saveInLocalStorage(key: string, filter: CarteraFilter) {
  const data = {
    fechaInicial: filter.fechaInicial.toISOString(),
    fechaFinal: filter.fechaFinal.toISOString(),
    registros: filter.registros.toString()
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function readFromLocalStorage(key: string): CarteraFilter {
  const data = JSON.parse(localStorage.getItem(key));
  if (data) {
    return {
      fechaInicial: moment(data.fechaInicial).toDate(),
      fechaFinal: moment(data.fechaFinal).toDate(),
      registros: data.registros
    };
  } else {
    return buildCarteraFilter();
  }
}
