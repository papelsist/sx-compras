import { TestBed, inject } from '@angular/core/testing';

import { ComprobanteFiscalService } from './comprobante-fiscal.service';

describe('ComprobanteFiscalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComprobanteFiscalService]
    });
  });

  it('should be created', inject([ComprobanteFiscalService], (service: ComprobanteFiscalService) => {
    expect(service).toBeTruthy();
  }));
});
