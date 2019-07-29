import { ComprasModule } from './compras.module';

describe('ComprasModule', () => {
  let comprasModule: ComprasModule;

  beforeEach(() => {
    comprasModule = new ComprasModule();
  });

  it('should create an instance', () => {
    expect(comprasModule).toBeTruthy();
  });
});
