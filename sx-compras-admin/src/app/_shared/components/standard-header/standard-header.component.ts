import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-standard-header',
  template: `
    <div layout layout-align="start center" class="pad">
      <span class="push-left-sm">
        <span class="mat-title">{{ title }}</span>
      </span>
      <ng-content select=".info"></ng-content>
      <span flex></span>
      <ng-container *ngIf="periodo">
        <sx-periodo-picker
          [periodo]="periodo"
          (change)="periodoChange.emit($event)"
        ></sx-periodo-picker>
      </ng-container>
      <ng-content select=".options"></ng-content>
      <span>
        <button mat-icon-button [matMenuTriggerFor]="toolbarMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #toolbarMenu="matMenu">
          <button mat-menu-item (click)="create.emit()">
            <mat-icon>add</mat-icon> Alta
          </button>
          <button mat-menu-item (click)="reload.emit()">
            <mat-icon>refresh</mat-icon> Recargar
          </button>
          <button
            mat-menu-item
            (click)="download.emit()"
            matTooltip="Descargar registros en formato CSV"
          >
            <mat-icon color="primary">file_download</mat-icon> Descargar
          </button>
          <ng-content select=".actions"></ng-content>
        </mat-menu>
      </span>
    </div>
  `
})
export class StandardHeaderComponent implements OnInit {
  @Input() title = 'Title';
  @Input() periodo: Periodo;

  @Output() periodoChange = new EventEmitter<Periodo>();

  @Output() create = new EventEmitter<Periodo>();
  @Output() reload = new EventEmitter<Periodo>();
  @Output() download = new EventEmitter<Periodo>();

  constructor() {}

  ngOnInit() {}

  @HostListener('document:keydown.control.i', ['$event'])
  onHotKeyInsert(event) {
    // console.log('Key: ', event);
    this.create.emit();
  }
  @HostListener('document:keydown.insert', ['$event'])
  onHotKeyInsert2(event) {
    this.create.emit();
  }
}
