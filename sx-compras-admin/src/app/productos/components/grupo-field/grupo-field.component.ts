import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-grupo-field',
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-label>Grupo de producto</mat-label>
      <mat-select
        placeholder="Grupo"
        formControlName="grupo"
        [compareWith]="compareWith"
      >
        <mat-option *ngFor="let grupo of grupos" [value]="grupo">
          {{ grupo.nombre }}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione un grupo</mat-error>
    </mat-form-field>
  `
})
export class GrupoFieldComponent implements OnInit {
  @Input() grupos: any[] = [];
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
