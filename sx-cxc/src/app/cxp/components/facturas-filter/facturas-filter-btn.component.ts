import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CxPFilter } from '../../model';
import { FacturasFilterComponent } from './facturas-filter.component';

@Component({
  selector: 'sx-facturas-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class RequisicionesFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: CxPFilter;
  @Output()
  change = new EventEmitter<CxPFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(FacturasFilterComponent, {
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
