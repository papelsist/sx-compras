export interface SolicitudDeDeposito {
  id: string;
  nombre: string;
  sucursal: string;
  sucursalNombre: string;
  cliente: string;
  banco: string;
  cuenta: string;
  cobro?: any;
  tipo: string;
  folio: number;
  fecha: string;
  fechaDeposito: string;
  referencia: string;
  cheque: number;
  efectivo: number;
  transferencia: number;
  total: number;
  comentario: string;
  cancelacion?: string;
  cancelacionComentario?: string;
  enviado: boolean;
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser: string;
  status: string;
}
