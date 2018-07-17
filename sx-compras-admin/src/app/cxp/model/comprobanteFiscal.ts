export interface ComprobanteFiscal {
  id: string;
  fileName: string;
  serie: string;
  folio: string;
  fecha: string;
  proveedor: { id: string };
  emisorNombre: string;
  emisorRfc: string;
  receptorNombre: string;
  receptorRfc: string;
  tipoDeComprobante: string;
  uuid: string;
  metodoDePago: string;
  formaDePago: string;
  moneda: string;
  tipoDeCambio: number;
  total: number;
  comentario: string;
  analizado: boolean;
  pdf: boolean;
  xml: boolean;
  selected?: boolean;
  versionCfdi: string;
}
