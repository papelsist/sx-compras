import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-ejercicio-field',
  template: `
  <ng-container [formGroup]="parent">
    <mat-form-field class="fill" >
      <mat-select placeholder="Año" formControlName="ejercicio" class="fill">
        <mat-option *ngFor="let year of years"
            [value]="year">{{ year }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </ng-container>
  `,
  styles: [
    `
    .fill {
      width: 100%;
    }
    `
  ]
})
export class EjercicioFieldComponent implements OnInit {
  @Input() parent: FormGroup;

  years = [2017, 2018, 2019, 2020];

  constructor() {}

  ngOnInit() {}
}
