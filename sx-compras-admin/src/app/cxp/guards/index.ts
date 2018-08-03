import { AnalisisGuard } from './analisis.guard';
import { AnalisisExistsGuard } from './analisis-exists.guard';
import { RequisicionExistsGuard } from './requisicion-exists.guard';
import { NotasGuard } from './notas.guard';
import { NotaExistsGuard } from './nota-exists.guard';

export const guards: any[] = [
  AnalisisGuard,
  AnalisisExistsGuard,
  RequisicionExistsGuard,
  NotasGuard,
  NotaExistsGuard
];

export * from './analisis.guard';
export * from './analisis-exists.guard';
export * from './requisicion-exists.guard';
export * from './notas.guard';
export * from './nota-exists.guard';
