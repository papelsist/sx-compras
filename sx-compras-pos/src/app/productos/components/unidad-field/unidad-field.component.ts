import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-unidad-field',
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Unidad" [formControlName]="entityField" >
        <mat-option *ngFor="let unidad of unidades" [value]="unidad">
          {{unidad}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una unidad</mat-error>
    </mat-form-field>
  `
})
export class UnidadFieldComponent implements OnInit {
  @Input() unidades: any[] = ['MILLAR', 'PIEZA', 'KILO', 'GRAMO', 'TONELADA'];
  @Input() parent: FormGroup;
  @Input() entityField = 'unidad';

  constructor() {}

  ngOnInit() {}
}
