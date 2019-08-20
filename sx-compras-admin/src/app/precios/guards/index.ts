import { ListasvGuard } from './listasv.guard';
import { ListavExistsGuard } from './listav-exists.guard';

export const guards: any[] = [ListasvGuard, ListavExistsGuard];

export * from './listasv.guard';
export * from './listav-exists.guard';
