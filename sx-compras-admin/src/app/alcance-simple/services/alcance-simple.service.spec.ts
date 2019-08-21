import { TestBed } from '@angular/core/testing';

import { AlcanceSimpleService } from './alcance-simple.service';

describe('AlcanceSimpleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlcanceSimpleService = TestBed.get(AlcanceSimpleService);
    expect(service).toBeTruthy();
  });
});
