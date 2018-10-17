import { CuentasModule } from './cuentas.module';

describe('CuentasModule', () => {
  let cuentasModule: CuentasModule;

  beforeEach(() => {
    cuentasModule = new CuentasModule();
  });

  it('should create an instance', () => {
    expect(cuentasModule).toBeTruthy();
  });
});
