import { Component, OnInit } from '@angular/core';

import { OrdenesService } from '../../services';
import { Compra } from '../../models/compra';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'sx-ordenes-pendientes',
  template: `
    <mat-card>
      <sx-search-title title="Ordenes de compra pendientes"></sx-search-title>
      <mat-divider></mat-divider>
      <sx-ordenes-table [dataSource]="dataSource" (select)="onSelect($event)"></sx-ordenes-table>
    </mat-card>
    <a mat-fab matTooltip="Nueva compra" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
	    <mat-icon>add</mat-icon>
    </a>
  `
})
export class OrdenesPendientesComponent implements OnInit {
  compras: Compra[];

  dataSource = new MatTableDataSource([]);

  constructor(private service: OrdenesService, private router: Router) {}

  ngOnInit() {
    this.service
      .list({ pendientes: true })
      .subscribe(compras => (this.dataSource.data = compras));
  }

  onSelect(row) {
    this.router.navigate(['/ordenes', row.id]);
  }
}
