import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';
import { SelectorCobrosComponent } from './selector-cobros.component';
import { Cobro } from 'app/ingresos/models';
import { Cliente } from 'app/models';

@Component({
  selector: 'sx-selector-cobros-btn',
  template: `
    <button mat-button type="button" [disabled]="disabled" (click)="find()">Buscar cobros</button>
  `
})
export class SelectorCobrosBtnComponent implements OnInit {
  @Input()
  disabled = false;
  @Output()
  select = new EventEmitter();
  @Input()
  cobros: Cobro[] = [];

  @Input()
  cliente: Cliente;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  find() {
    this.dialog
      .open(SelectorCobrosComponent, {
        data: { cobros: this.cobros, cliente: this.cliente },
        width: '850px',
        minHeight: '400px'
      })
      .afterClosed()
      .subscribe(selected => {
        if (selected) {
          this.select.emit(selected);
        }
      });
  }
}
