import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  Input
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { NotaCreateModalComponent } from './nota-create-modal.component';
import { Cartera } from 'app/cobranza/models';

@Component({
  selector: 'sx-nota-create-btn',
  template: `
    <a
      mat-fab
      color="accent"
      class="mat-fab-position-bottom-right z3"
      (click)="createNota()"
    >
      <mat-icon>add</mat-icon>
    </a>
  `
})
export class NotaCreateBtnComponent implements OnInit {
  @Output() create = new EventEmitter<any>();
  @Input() tipo: string;
  @Input() cartera: Cartera;
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  createNota() {
    this.dialog
      .open(NotaCreateModalComponent, {
        data: { tipo: this.tipo, cartera: this.cartera },
        width: '650px'
      })
      .afterClosed()
      .subscribe(nota => {
        if (nota) {
          this.create.emit(nota);
        }
      });
  }
}
