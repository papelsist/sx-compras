import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { ProveedorProducto } from '../models/proveedorProducto';

@Injectable()
export class ProveedorProductoService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  list(proveedorId: string): Observable<ProveedorProducto[]> {
    const url = this.getUrl(proveedorId);
    return this.http.get<ProveedorProducto[]>(url);
  }

  get(proveedorId: string, id: string): Observable<ProveedorProducto> {
    const url = `${this.getUrl(proveedorId)}/${id}`;
    return this.http.get<ProveedorProducto>(url);
  }

  save(prod: ProveedorProducto): Observable<ProveedorProducto> {
    const url = `${this.getUrl(prod.proveedor.id)}`;
    return this.http
      .post<ProveedorProducto>(url, prod)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(prod: ProveedorProducto): Observable<ProveedorProducto> {
    const url = `${this.getUrl(prod.proveedor.id)}/${prod.id}`;
    return this.http
      .put<ProveedorProducto>(url, prod)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(proveedorId: string, id: string) {
    const url = `${this.getUrl(proveedorId)}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  getUrl(proveedorId: string) {
    return this.config.buildApiUrl(`proveedores/${proveedorId}/productos`);
  }
}
