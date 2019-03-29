import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EnviosFilter } from '../../model';
import { EnviosFilterComponent } from './envios-filter.component';

@Component({
  selector: 'sx-envios-filter-btn',
  template: `
  <button mat-button mat-icon-button (click)="openFilter()" ><mat-icon [color]="color">filter_list</mat-icon></button>
  `
})
export class EnviosFilterBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  filter: EnviosFilter;
  @Output()
  change = new EventEmitter<EnviosFilter>();
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openFilter() {
    this.dialog
      .open(EnviosFilterComponent, {
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
