import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProveedorPeriodoFilterDialogComponent } from './proveedor-periodo-filter-dialog.component';
import { ProveedorPeriodoFilter } from 'app/cxp/model/proveedorPeriodoFilter';

@Component({
  selector: 'sx-proveedor-periodo-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class ProveedorPeriodoFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: ProveedorPeriodoFilter;
  @Output()
  change = new EventEmitter<ProveedorPeriodoFilter>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(ProveedorPeriodoFilterDialogComponent, {
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
