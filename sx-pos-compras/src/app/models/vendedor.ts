export interface Vendedor {
  id?: string
  activo: boolean
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  nombre: string
  curp?: string
  rfc?: string
  comisionContado?: number
  comisionCredito?: number
  dateCreated?: string
  lastUpdated?: string
}