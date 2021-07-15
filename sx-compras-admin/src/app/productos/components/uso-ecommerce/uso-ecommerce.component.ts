import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../../utils/config.service';


@Component({
  selector: 'sx-uso-ecommerce-field',
  template: `
  <ng-container *ngIf="usos$ | async as usos">
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Uso Ecommerce" formControlName="usoEcommerce" [compareWith]="compareWith">
        <mat-option value="null"> Ninguno </mat-option>
        <mat-option *ngFor="let u of usos" [value]="u">
          {{u.nombre}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione un uso</mat-error>
    </mat-form-field>
  </ng-container>
  `
})
export class UsoEcommerceComponent implements OnInit {
   @Input()
  parent: FormGroup;
  usos$: Observable<any[]>;

  constructor(private http: HttpClient, private config: ConfigService) {}

  ngOnInit() {
    const url = this.config.buildApiUrl('usoEcommerce');
    this.usos$ = this.http
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
