import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';
import { SelectorCxpRembolsoComponent } from './selector-cxp-rembolso.component';

@Component({
  selector: 'sx-selector-cxp-rembolso-btn',
  template: `
    <button mat-button type="button" [disabled]="disabled" (click)="find()">Facturas</button>
  `
})
export class SelectorCxpRembolsoBtnComponent implements OnInit {
  @Input()
  disabled = false;
  @Output()
  select = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  find() {
    this.dialog
      .open(SelectorCxpRembolsoComponent, {
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
