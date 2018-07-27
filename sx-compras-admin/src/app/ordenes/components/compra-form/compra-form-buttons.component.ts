import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Compra } from '../../models/compra';

@Component({
  selector: 'sx-compra-form-buttons',
  template: `
  <mat-card-actions>
    <button type="button" mat-button [routerLink]="['../']">
      <mat-icon>arrow_back</mat-icon> Compras
    </button>
    <button type="button" mat-button color="primary" (click)="save.emit($event)" *ngIf="!compra.cerrada"
       [disabled]="parent.invalid || parent.pristine">
      <mat-icon>save</mat-icon> Salvar
    </button>
    <button type="button" mat-button color="warn" *ngIf="canDelete()" (click)="delete.emit()">
      <mat-icon>delete</mat-icon> Eliminar
    </button>
    <button type="button" mat-button color="imprimir" *ngIf="canPrint()">
      <mat-icon>print</mat-icon> Imprimir
    </button>
  </mat-card-actions>
  `
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompraFormButtonsComponent implements OnInit {
  @Output() print = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Input() parent: FormGroup;
  @Input() compra: Compra;
  @Input() status: string;
  constructor() {}

  ngOnInit() {}

  canDelete() {
    switch (this.status) {
      case undefined:
        return false;
      case 'P':
        return true;
      case 'T':
        return false;
      default:
        return true;
    }
  }

  canPrint() {
    return this.status ? true : false;
  }
}
