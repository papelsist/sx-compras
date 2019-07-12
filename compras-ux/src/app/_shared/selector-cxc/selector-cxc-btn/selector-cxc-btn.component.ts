import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Cliente } from 'app/models';
import { MatDialog } from '@angular/material';

import { CuentaPorCobrar } from 'app/cobranza/models';
import { SelectorModalComponent } from '../selector-modal/selector-modal.component';

@Component({
  selector: 'sx-selector-cxc-btn',
  template: `
    <button mat-button (click)="seleccionar()" color="primary">
      <mat-icon>add</mat-icon> {{ label }}
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorCxcBtnComponent implements OnInit {
  @Input() cliente: Partial<Cliente>;
  @Input() nombre: string;

  @Input() label = 'FACTURAS';

  @Output() selected = new EventEmitter<Partial<CuentaPorCobrar>[]>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  seleccionar() {
    this.dialog
      .open(SelectorModalComponent, {
        data: {
          cliente: this.cliente,
          nombre: this.nombre
        },
        minWidth: '650px'
      })
      .afterClosed()
      .subscribe(selected => {
        if (selected) {
          this.selected.emit(selected);
        }
      });
  }
}
