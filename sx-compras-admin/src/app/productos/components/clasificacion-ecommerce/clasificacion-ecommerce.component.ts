import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../../utils/config.service';


@Component({
  selector: 'sx-clasificacion-ecommerce-field',
  template: `
  <ng-container *ngIf="clasificaciones$ | async as clasificaciones">
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Clasificacion Ecommerce" formControlName="clasificacionEcommerce" [compareWith]="compareWith">
        <mat-option value="null"> Ninguno </mat-option>
        <mat-option *ngFor="let c of clasificaciones" [value]="c">
          {{c.nombre}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una clasificacion</mat-error>
    </mat-form-field>
  </ng-container>
  `
})
export class ClasificacionEcommerceComponent implements OnInit {
   @Input()
  parent: FormGroup;
  clasificaciones$: Observable<any[]>;

  constructor(private http: HttpClient, private config: ConfigService) {}

  ngOnInit() {
    const url = this.config.buildApiUrl('clasificacionesEcommerce');
    this.clasificaciones$ = this.http
      .get<any[]>(url)
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  compareWith(o1: any, o2: any) {
        if (o1 && o2) {
        return o1.id === o2.id;
        } else {
        return false;
        }
    }

}
