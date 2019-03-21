import { Envio } from './envio';
import { Producto } from 'app/productos/models/producto';

export interface EnvioDet {
  id: string;
  envio: Partial<Envio>;
  ventaDet: any;
  producto: Partial<Producto>;
  cantidad: number;
  valor: number;
  kilos: number;
  instruccionEntregaParcial: string;
  dateCreated: string;
  lastUpdated: string;
}
