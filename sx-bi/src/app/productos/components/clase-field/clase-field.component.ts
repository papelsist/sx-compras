import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-clase-field',
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Clase" formControlName="clase" [compareWith]="compareWith">
        <mat-option *ngFor="let clase of clases" [value]="clase">
          {{clase.clase}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una clase</mat-error>
    </mat-form-field>
  `
})
export class ClaseFieldComponent implements OnInit {
  @Input() clases: any[] = [];
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
