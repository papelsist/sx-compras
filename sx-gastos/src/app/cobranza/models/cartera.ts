export class Cartera {
  constructor(
    public clave: 'CRE' | 'COD' | 'CON' | 'CHE' | 'JUR' | 'CHO',
    public descripcion: string
  ) {}
}

export const CARTERAS = {
  CRE: new Cartera('CRE', 'CREDITO'),
  COD: new Cartera('COD', 'CONTRA ENTREGA'),
  CON: new Cartera('CON', 'CONTADO'),
  CHE: new Cartera('CHE', 'CHEQUE'),
  JUR: new Cartera('JUR', 'JURIDICO'),
  CHO: new Cartera('CHO', 'CHOFER')
};
