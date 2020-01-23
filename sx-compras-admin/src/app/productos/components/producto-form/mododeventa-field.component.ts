import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-modovta-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100" required="true">
      <mat-select placeholder="Mdo de venta" formControlName="modoVenta" >
        <mat-option *ngFor="let p of tipos" [value]="p">
          {{p === 'B' ? 'BRUTO' : 'NETO'}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione un modo de venta</mat-error>
    </mat-form-field>
  `
})
export class MododeventaFieldComponent implements OnInit {
  @Input()
  tipos: string[] = ['B', 'N'];
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {}
}
