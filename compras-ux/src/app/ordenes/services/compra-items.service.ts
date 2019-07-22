import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';

import { CompraDet } from '../models/compraDet';
import { Update } from '@ngrx/entity';

@Injectable()
export class CompraItemsService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.buildApiUrl('compras');
  }

  list(compraId: string): Observable<CompraDet[]> {
    const url = `${this.apiUrl}/${compraId}/list`;
    return this.http.get<CompraDet[]>(url);
  }

  get(id: string): Observable<CompraDet> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CompraDet>(url);
  }

  save(compraId: string, item: Partial<CompraDet>): Observable<CompraDet> {
    const url = `${this.apiUrl}/${compraId}/list`;
    return this.http.post<CompraDet>(this.apiUrl, item);
  }

  update(compraId: string, item: Update<CompraDet>): Observable<CompraDet> {
    const url = `${this.apiUrl}/${compraId}`;
    return this.http
      .put<CompraDet>(url, item.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .delete(url)
      .pipe(catchError((error: any) => throwError(error)));
  }
}
