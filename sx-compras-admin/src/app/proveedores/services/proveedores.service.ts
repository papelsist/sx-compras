import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from '../../utils/config.service';
import { Proveedor } from '../models/proveedor';

@Injectable()
export class ProveedoresService {
  private _apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.apiUrl = config.buildApiUrl('proveedores');
  }

  list(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  getProductos(proveedor: Proveedor): Observable<Array<any>> {
    const url = `${this.apiUrl}/${proveedor.id}/productos`;
    return this.http.get<Array<any>>(url);
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
}
