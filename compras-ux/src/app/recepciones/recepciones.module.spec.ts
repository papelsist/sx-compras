import { RecepcionesModule } from './recepciones.module';

describe('RecepcionesModule', () => {
  let recepcionesModule: RecepcionesModule;

  beforeEach(() => {
    recepcionesModule = new RecepcionesModule();
  });

  it('should create an instance', () => {
    expect(recepcionesModule).toBeTruthy();
  });
});
