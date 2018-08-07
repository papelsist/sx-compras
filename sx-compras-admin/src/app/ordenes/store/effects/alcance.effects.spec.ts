import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AlcanceEffects } from './alcance.effects';

describe('AlcanceService', () => {
  let actions$: Observable<any>;
  let effects: AlcanceEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlcanceEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(AlcanceEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
