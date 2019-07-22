import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../../../utils/config.service';

@Component({
  selector: 'sx-unidad-sat-field',
  template: `
  <ng-container *ngIf="unidades$ | async as unidades">
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Unidad SAT" formControlName="unidadSat" [compareWith]="compareWith">
        <mat-option value="null"> Ninguna </mat-option>
        <mat-option *ngFor="let p of unidades" [value]="p">
        {{p.claveUnidadSat}} - {{p.unidadSat}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una unidad</mat-error>
    </mat-form-field>
  </ng-container>
  `
})
export class UnidadSatComponent implements OnInit {
  @Input()
  parent: FormGroup;
  unidades$: Observable<any[]>;

  constructor(private http: HttpClient, private config: ConfigService) {}

  ngOnInit() {
    const url = this.config.buildApiUrl('unidadSat');
    this.unidades$ = this.http
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
