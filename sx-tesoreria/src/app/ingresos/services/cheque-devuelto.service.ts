import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../utils/config.service';
import { ChequeDevuelto } from '../models';
import { PeriodoFilter } from 'app/models';

@Injectable()
export class ChequeDevueltoService {
  private apiUrl: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('cxc/chequesDevuetos');
  }

  get(id: string): Observable<ChequeDevuelto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<ChequeDevuelto>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  list(filter: PeriodoFilter): Observable<ChequeDevuelto[]> {
    const params = new HttpParams()
      .set('registros', filter.registros.toString())
      .set('fechaInicial', filter.fechaInicial.toISOString())
      .set('fechaFinal', filter.fechaFinal.toISOString());
    return this.http
      .get<ChequeDevuelto[]>(this.apiUrl, { params: params })
      .pipe(catchError((error: any) => throwError(error)));
  }

  save(cheque: ChequeDevuelto): Observable<ChequeDevuelto> {
    return this.http
      .post<ChequeDevuelto>(this.apiUrl, cheque)
      .pipe(catchError((error: any) => throwError(error)));
  }

  delete(cheque: ChequeDevuelto) {
    const url = `${this.apiUrl}/${cheque.id}`;
    return this.http
      .delete<ChequeDevuelto>(url)
      .pipe(catchError((error: any) => throwError(error)));
  }

  update(update: {
    id: string | number;
    changes: Partial<ChequeDevuelto>;
  }): Observable<ChequeDevuelto> {
    const url = `${this.apiUrl}/${update.id}`;
    return this.http
      .put<ChequeDevuelto>(url, update.changes)
      .pipe(catchError((error: any) => throwError(error)));
  }

  generarNota(id: string): Observable<ChequeDevuelto> {
    const url = `${this.apiUrl}/generarNotaDeCargo/${id}`;
    return this.http
      .post<ChequeDevuelto>(url, {})
      .pipe(catchError((error: any) => throwError(error)));
  }

  fetchXml(id: string): Observable<any> {
    const url = `${this.config.buildApiUrl('cfdi')}/mostrarXml/${id}`;
    const headers = new HttpHeaders().set('Content-type', 'text/xml');
    return this.http
      .get(url, {
        headers: headers,
        responseType: 'blob'
      })
      .pipe(catchError((error: any) => throwError(error)));
  }

  mostrarXml(cfdiId: string) {
    this.fetchXml(cfdiId).subscribe(
      res => {
        const blob = new Blob([res], {
          type: 'text/xml'
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error => console.error('Error descrgando XML de CFDI: ', cfdiId)
    );
  }
}
