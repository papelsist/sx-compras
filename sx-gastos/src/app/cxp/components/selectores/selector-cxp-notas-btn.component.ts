import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';
import { SelectorCxpNotasComponent } from './selector-cxp-notas.component';
import { Proveedor } from 'app/proveedores/models/proveedor';

@Component({
  selector: 'sx-selector-cxp-notas-btn',
  template: `
    <button mat-button type="button" [disabled]="disabled" (click)="find()">Notas de crédito</button>
  `
})
export class SelectorCxpNotasBtnComponent implements OnInit {
  @Input()
  disabled = false;

  @Input()
  proveedor: Partial<Proveedor>;

  @Output()
  select = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  find() {
    this.dialog
      .open(SelectorCxpNotasComponent, {
        data: { proveedor: this.proveedor },
        width: '850px',
        minHeight: '350px'
      })
      .afterClosed()
      .subscribe(selected => {
        if (selected) {
          this.select.emit(selected);
        }
      });
  }
}
