import { CompraEffects } from './compra.effects';
import { AlcanceEffects } from './alcance.effects';
import { ProductosDisponiblesEffects } from './productos-disponibles.effects';

export const effects: any[] = [
  CompraEffects,
  AlcanceEffects,
  ProductosDisponiblesEffects
];

export * from './compra.effects';
export * from './alcance.effects';
export * from './productos-disponibles.effects';
