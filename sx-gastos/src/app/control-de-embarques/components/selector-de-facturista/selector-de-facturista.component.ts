import { Component, OnInit, Inject } from '@angular/core';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'sx-selector-de-facturista',
  template: `
  <h2 mat-dialog-title>Facturistas de embarque</h2>
  <mat-divider></mat-divider>
  <mat-dialog-content>
    <mat-nav-list class="mat-elevation-z8">
      <a mat-list-item *ngFor="let item of facturistas" (click)="select(item)">
        {{item.nombre}}
      </a>
    </mat-nav-list>
  </mat-dialog-content>
  `
})
export class SelectorDeFacturistaComponent implements OnInit {
  facturistas: FacturistaDeEmbarque[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SelectorDeFacturistaComponent>
  ) {
    this.facturistas = data.facturistas || [];
  }

  ngOnInit() {}

  select(event: FacturistaDeEmbarque) {
    this.dialogRef.close(event);
  }
}
