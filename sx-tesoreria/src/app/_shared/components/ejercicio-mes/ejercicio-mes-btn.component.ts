import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EjercicioMes } from 'app/models/ejercicioMes';
import { EjercicioMesComponent } from './ejercicio-mes.component';

@Component({
  selector: 'sx-ejercicio-mes-btn',
  template: `
    <button mat-button (click)="select()">
      <mat-icon>today</mat-icon>
      <span *ngIf="periodo">
        {{periodo.mes}}-{{periodo.ejercicio}}
      </span>
    </button>
  `
})
export class EjercicioMesBtnComponent implements OnInit {
  @Input()
  periodo: EjercicioMes;

  @Output()
  change = new EventEmitter<EjercicioMes>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  select() {
    this.dialog
      .open(EjercicioMesComponent, {
        data: { periodo: this.periodo }
      })
      .afterClosed()
      .subscribe(periodo => {
        if (periodo) {
          this.change.emit(periodo);
        }
      });
  }
}
