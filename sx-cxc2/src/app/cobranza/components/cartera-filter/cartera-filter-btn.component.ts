import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CarteraFilterComponent } from './cartera-filter.component';
import { CarteraFilter } from '../../models';

@Component({
  selector: 'sx-cartera-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class CarteraFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: CarteraFilter;
  @Output()
  change = new EventEmitter<CarteraFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(CarteraFilterComponent, {
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
