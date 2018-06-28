import { AnalisisGuard } from './analisis.guard';
import { AnalisisExistsGuard } from './analisis-exists.guard';
import { RequisicionExistsGuard } from './requisicion-exists.guard';

export const guards: any[] = [
  AnalisisGuard,
  AnalisisExistsGuard,
  RequisicionExistsGuard
];

export * from './analisis.guard';
export * from './analisis-exists.guard';
export * from './requisicion-exists.guard';
