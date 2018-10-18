import { TestBed, inject } from '@angular/core/testing';

import { ClasesService } from './clases.service';

describe('ClasesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClasesService]
    });
  });

  it('should be created', inject([ClasesService], (service: ClasesService) => {
    expect(service).toBeTruthy();
  }));
});
