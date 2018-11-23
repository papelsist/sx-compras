import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CxPFilter, PagosFilter } from '../../model';
import { PagosFilterComponent } from './pagos-filter.component';

@Component({
  selector: 'sx-pagos-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class PagosFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: PagosFilter;
  @Output()
  change = new EventEmitter<PagosFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(PagosFilterComponent, {
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
