import { TestBed, inject } from '@angular/core/testing';

import { LineasService } from './lineas.service';

describe('LineasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineasService]
    });
  });

  it('should be created', inject([LineasService], (service: LineasService) => {
    expect(service).toBeTruthy();
  }));
});
