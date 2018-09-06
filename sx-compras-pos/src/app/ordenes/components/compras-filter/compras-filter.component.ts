import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ComprasFilter } from '../../models/compra';
import { ComprasFilterDialogComponent } from './compras-filter-dialog.component';

@Component({
  selector: 'sx-compras-filter',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class ComprasFilterComponent implements OnInit {
  @Input() color = 'primary';
  @Input() filter: ComprasFilter;
  @Output() change = new EventEmitter<ComprasFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(ComprasFilterDialogComponent, {
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
