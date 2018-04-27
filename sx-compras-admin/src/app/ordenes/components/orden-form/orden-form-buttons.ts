import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-orden-form-buttons',
  template: `
  <mat-card-actions>
    <button type="button" mat-icon-button [routerLink]="['../']">
      <mat-icon>arrow_back</mat-icon>
    </button>
    <button type="button" mat-button color="primary" (click)="save.emit($event)"
       [disabled]="parent.invalid || parent.pristine">
      <mat-icon>save</mat-icon> Salvar
    </button>
    <button type="button" mat-button color="warn">
      <mat-icon>delete</mat-icon> Eliminar
    </button>
    <button type="button" mat-button color="imprimir">
      <mat-icon>print</mat-icon> Imprimir
    </button>
  </mat-card-actions>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdenFormButtonsComponent implements OnInit {
  @Output() print = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {}
}
