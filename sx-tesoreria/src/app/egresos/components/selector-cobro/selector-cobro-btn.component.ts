import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';
import { SelectorMorrallaComponent } from './selector-morralla.component';

@Component({
  selector: 'sx-selector-cobro-btn',
  template: `
    <button mat-button type="button" [disabled]="disabled" (click)="find()">Buscar morralla</button>
  `
})
export class SelectorMorrallaBtnComponent implements OnInit {
  @Input()
  disabled = false;
  @Output()
  select = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  find() {
    this.dialog
      .open(SelectorMorrallaComponent, {
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
