import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CompraEffects } from './compra.effects';

describe('CompraService', () => {
  let actions$: Observable<any>;
  let effects: CompraEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompraEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(CompraEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
