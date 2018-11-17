import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { Proveedor } from '../models/proveedor';
import { ProveedorProducto } from '../models/proveedorProducto';

@Injectable()
export class ProveedoresService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.apiUrl = config.buildApiUrl('proveedores');
  }

  list(): Observable<Proveedor[]> {
    const params = new HttpParams().set('tipo', 'GASTOS');
    return this.http.get<Proveedor[]>(this.apiUrl, { params: params });
  }

  getProductos(proveedor: Proveedor): Observable<ProveedorProducto[]> {
    const url = `${this.apiUrl}/${proveedor.id}/productos`;
    return this.http.get<ProveedorProducto[]>(url);
  }

  get(id: string): Observable<Proveedor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Proveedor>(url);
  }

  get apiUrl() {
    if (!this._apiUrl) {
      this._apiUrl = this.config.buildApiUrl('proveedores');
    }
    return this._apiUrl;
  }

  save(proveedor: Proveedor): Observable<Proveedor> {
    return this.http
      .post<Proveedor>(this.apiUrl, proveedor)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(proveedor: Proveedor): Observable<Proveedor> {
    const url = `${this.apiUrl}/${proveedor.id}`;
    return this.http
      .put<Proveedor>(url, proveedor)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
