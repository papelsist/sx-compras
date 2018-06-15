import { AnalisisGuard } from './analisis.guard';
import { AnalisisExistsGuard } from './analisis-exists.guard';

export const guards: any[] = [AnalisisGuard, AnalisisExistsGuard];

export * from './analisis.guard';
export * from './analisis-exists.guard';
