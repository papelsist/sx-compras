import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-presentacion-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="parent" [style.width.%]="100" required="true">
      <mat-select placeholder="Presentación" [formControlName]="entityField" >
        <mat-option *ngFor="let p of tipos" [value]="p">
          {{p}}
        </mat-option>
      </mat-select>
      <mat-error>Seleccione la presentación</mat-error>
    </mat-form-field>
  `
})
export class PresentacionFieldComponent implements OnInit {
  @Input() tipos: any[] = ['EXTENDIDO', 'CORTADO', 'BOBINA', 'ND'];
  @Input() parent: FormGroup;
  @Input() entityField = 'presentacion';

  constructor() {}

  ngOnInit() {}
}
