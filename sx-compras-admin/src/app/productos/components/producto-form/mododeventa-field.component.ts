import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-modovta-field',
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100" required="true">
      <mat-select placeholder="Mdo de venta" formControlName="modoVenta" [compareWith]="compareWith">
        <mat-option *ngFor="let p of tipos" [value]="p.id">
          {{p.descripcion}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione un modo de venta</mat-error>
    </mat-form-field>
  `
})
export class MododeventaFieldComponent implements OnInit {
  @Input()
  tipos: any[] = [
    { id: 'B', descripcion: 'BRUTO' },
    { id: 'N', descripcion: 'NETO' }
  ];
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
