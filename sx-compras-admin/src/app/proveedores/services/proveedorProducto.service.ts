import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { ProveedorProducto } from '../models/proveedorProducto';
import { Producto } from '../../productos/models/producto';

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

  disponibles(data: {
    proveedorId: string;
    moneda: string;
  }): Observable<Producto[]> {
    const url = `${this.getUrl(data.proveedorId)}/disponibles`;
    const params = new HttpParams().set('moneda', data.moneda);
    return this.http.get<Producto[]>(url, { params: params });
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

  delete(prodProv: ProveedorProducto) {
    const url = `${this.getUrl(prodProv.proveedor.id)}/${prodProv.id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  agregarProductos(command: {
    proveedorId: string;
    moneda: string;
    productos: string[];
  }): Observable<ProveedorProducto[]> {
    const url = `${this.getUrl(command.proveedorId)}/agregarProductos`;
    return this.http
      .put<ProveedorProducto[]>(url, command)
      .pipe(catchError((error: any) => throwError(error)));
  }

  getUrl(proveedorId: string) {
    return this.config.buildApiUrl(`proveedores/${proveedorId}/productos`);
  }
}
