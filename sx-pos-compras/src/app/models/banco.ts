import { BancoSat } from './bancoSat';

export interface Banco {
  id?: string;
  nombre: string;
  bancoSat: BancoSat;
  nacional: boolean;
}
