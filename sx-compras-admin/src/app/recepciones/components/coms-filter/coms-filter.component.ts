import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ComsFilter } from '../../models/recepcionDeCompra';
import { ComsFilterDialogComponent } from './coms-filter-dialog.component';

@Component({
  selector: 'sx-coms-filter',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class ComsFilterComponent implements OnInit {
  @Input() color = 'primary';
  @Input() filter: ComsFilter;
  @Output() change = new EventEmitter<ComsFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(ComsFilterDialogComponent, {
        data: { filter: this.filter }
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.change.emit(command);
        }
      });
  }
}
