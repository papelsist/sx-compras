import { Requisicion } from './requisicion';

export interface PagoDeRequisicion {
  requisicion: Requisicion;
  cuenta: string;
  referencia: string;
}
