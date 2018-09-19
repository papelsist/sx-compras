import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-marca-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100">
      <mat-select placeholder="Marca" formControlName="marca" [compareWith]="compareWith">
        <mat-option *ngFor="let marca of marcas" [value]="marca">
          {{marca.marca}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione una marca</mat-error>
    </mat-form-field>
  `
})
export class MarcaFieldComponent implements OnInit {
  @Input() marcas: any[] = [];
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
