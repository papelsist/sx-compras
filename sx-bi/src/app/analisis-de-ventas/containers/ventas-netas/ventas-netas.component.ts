import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { VentaFilter } from 'app/analisis-de-ventas/models/venta-filter';
import { VentaNeta } from 'app/analisis-de-ventas/models/venta-neta';
import { SetSelectedVenta } from '../../store';
import { MatDialog } from '@angular/material';
import { ReportService } from 'app/reportes/services/report.service';
import {
  BajaEnVentasComponent,
  MejoresClientesComponent,
  VentasClientesResumenComponent,
  ClienteSinVentasComponent
} from 'app/analisis-de-ventas/reportes';

@Component({
  selector: 'sx-ventas-netas',
  templateUrl: './ventas-netas.component.html'
})
export class VentasNetasComponent implements OnInit {
  ventas$: Observable<any[]>;
  loading$: Observable<boolean>;
  filter$: Observable<VentaFilter>;
  search: string;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getVentaNetaLoading));
    this.ventas$ = this.store.pipe(select(fromStore.getAllVentaNeta));
    this.filter$ = this.store.pipe(select(fromStore.getVentaFilter));
  }

  onSearch(event: string) {
    this.search = event;
  }

  drill(event: VentaNeta) {
    this.store.dispatch(new SetSelectedVenta({ selected: event }));
    this.store.dispatch(
      new fromRoot.Go({
        path: ['analisisDeVentas', event.origenId]
      })
    );
  }

  bajaEnVentas() {
    this.run('bi/bajaEnVentas', BajaEnVentasComponent, {
      data: { title: 'Baja en Ventas' }
    });
  }
  mejoresClientes() {
    this.run('bi/mejoresClientes', MejoresClientesComponent, {});
  }
  ventasClientesResumen() {
    this.run('bi/ventasClientesResumen', VentasClientesResumenComponent, {});
  }

  clienteSinVentas() {
    this.run('bi/clienteSinVentas', ClienteSinVentasComponent, {
      data: { title: 'Cliente sin Ventas' }
    });
  }

  run(path: string, component, data) {
    this.dialog
      .open(component, data)
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.reportService.runReport(path, command);
        }
      });
  }
}
