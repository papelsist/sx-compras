import { ProductosEffects } from './productos.effects';
import { LineasEffects } from './lineas.effects';
import { MarcasEffects } from './marcas.effects';
import { ClasesEffects } from './clases.effects';
import { GruposEffects } from './grupos.effects';

export const effects: any[] = [
  ProductosEffects,
  LineasEffects,
  MarcasEffects,
  ClasesEffects,
  GruposEffects
];

export * from './productos.effects';
export * from './lineas.effects';
export * from './marcas.effects';
export * from './clases.effects';
export * from './grupos.effects';
