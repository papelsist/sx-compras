import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../../utils/config.service';

@Component({
  selector: 'sx-producto-sat-field',
  template: `
    <ng-container *ngIf="(productos$ | async) as productos">
      <mat-form-field [formGroup]="parent" [style.width.%]="100">
        <mat-select
          placeholder="Producto SAT"
          formControlName="productoSat"
          [compareWith]="compareWith"
        >
          <mat-option value="null"> Ninguno </mat-option>
          <mat-option *ngFor="let p of productos" [value]="p">
            {{ p.claveProdServ }} - {{ p.descripcion }}
          </mat-option>
        </mat-select>
        <mat-error>Seleccione un producto</mat-error>
      </mat-form-field>
    </ng-container>
  `
})
export class ProductoSatComponent implements OnInit {
  @Input()
  parent: FormGroup;
  productos$: Observable<any[]>;

  constructor(private http: HttpClient, private config: ConfigService) {}

  ngOnInit() {
    const url = this.config.buildApiUrl('productoSat');
    const params = new HttpParams().set('max', '200');
    this.productos$ = this.http
      .get<any[]>(url, {params})
      .pipe(catchError((error: any) => throwError(error)));
  }

  compareWith(o1: any, o2: any) {
    if (o1 && o2) {
      return o1.id === o2.id;
    } else {
      return false;
    }
  }
}
