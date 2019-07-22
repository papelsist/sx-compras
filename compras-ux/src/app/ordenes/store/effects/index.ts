import { CompraEffects } from './compra.effects';
import { AlcanceEffects } from './alcance.effects';
import { ProductosDisponiblesEffects } from './productos-disponibles.effects';
import { CompraItemsEffects } from './compra-items.effects';

export const effects: any[] = [
  CompraEffects,
  CompraItemsEffects,
  AlcanceEffects,
  ProductosDisponiblesEffects
];

export * from './compra.effects';
export * from './compra-items.effects';
export * from './alcance.effects';
export * from './productos-disponibles.effects';
