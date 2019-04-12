import { TestBed } from '@angular/core/testing';

import { NotaDeCargoService } from './nota-de-cargo.service';

describe('NotaDeCargoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotaDeCargoService = TestBed.get(NotaDeCargoService);
    expect(service).toBeTruthy();
  });
});
