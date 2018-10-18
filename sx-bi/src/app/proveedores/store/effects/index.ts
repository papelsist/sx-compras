import { ProveedoresEffects } from './proveedores.effects';
import { ProveedorProductosEffects } from './proveedorProductos.effects';
import { ListaDePreciosEffects } from './listaDePrecios.effects';

export const effects: any[] = [
  ProveedoresEffects,
  ProveedorProductosEffects,
  ListaDePreciosEffects
];

export * from './proveedores.effects';
export * from './proveedorProductos.effects';
export * from './listaDePrecios.effects';
