import { TestBed } from '@angular/core/testing';

import { ExistenciaService } from './existencia.service';

describe('ExistenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExistenciaService = TestBed.get(ExistenciaService);
    expect(service).toBeTruthy();
  });
});
