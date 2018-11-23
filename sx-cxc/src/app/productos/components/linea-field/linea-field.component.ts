import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-linea-field',
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Línea" formControlName="linea" [compareWith]="compareWith">
        <mat-option *ngFor="let linea of lineas" [value]="linea">
          {{linea.linea}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una línea</mat-error>
    </mat-form-field>
  `
})
export class LineaFieldComponent implements OnInit {
  @Input() lineas: any[] = [];
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {}

  compareWith(o1: any, o2: any) {
    if (o1 && o2) {
      return o1.id === o2.id;
    } else {
      return false;
    }
  }
}
