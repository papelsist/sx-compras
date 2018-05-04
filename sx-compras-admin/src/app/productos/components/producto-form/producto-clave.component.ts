import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-producto-clave',
  template: `
    <mat-form-field [formGroup]="parent" >
      <input matInput placeholder="Clave" sxUpperCase formControlName="clave" autocomplete="off" required="true">
      <mat-error *ngIf="getError()">{{getError()}}</mat-error>
    </mat-form-field>
  `,
  styles: [
    `.mat-form-field {
      width: 100%;
    }`
  ]
})
export class ProductoClaveComponent implements OnInit {
  @Input() parent: FormGroup;

  constructor() {}

  ngOnInit() {}

  get control() {
    return this.parent.get('clave');
  }

  private hasError(code: string) {
    return this.control.hasError(code);
  }

  getError() {
    if (this.hasError('minlength')) {
      const error = this.control.getError('minlength');
      return `Longitud mínima requerida ${error.requiredLength}`;
    } else if (this.hasError('maxlength')) {
      const error = this.control.getError('maxlength');
      return `Longitud máxima  (${error.requiredLength}) excedida`;
    } else if (this.hasError('required')) {
      return 'Digite la clave';
    }
    return null;
  }
}
