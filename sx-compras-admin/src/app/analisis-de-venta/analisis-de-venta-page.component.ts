import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Periodo } from 'app/_core/models/periodo';
import { AnalisisDeVentaService } from './analisis-de-venta.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'sx-analisis-de-venta',
  templateUrl: './analisis-de-venta-page.component.html',
  styleUrls: ['./analisis-de-venta-page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalisisDeVentaComponent implements OnInit {
  periodo: Periodo;
  rows$: any[];
  // loading$: Observable<boolean>;
  loading$ = new BehaviorSubject<boolean>(false);
  STORAGE_KEY = 'sx.compras.analisis-de-ventas.periodo';

  constructor(private service: AnalisisDeVentaService) {}

  ngOnInit() {
    this.periodo = Periodo.fromStorage(this.STORAGE_KEY, Periodo.fromNow(7));
  }

  onPeriodo(event: Periodo) {
    this.periodo = event;
    Periodo.saveOnStorage(this.STORAGE_KEY, this.periodo);
    this.onReload(this.periodo);
  }

  onReload(periodo: Periodo) {
    this.loading$.next(true);
    this.service
      .fetchVentas(periodo)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(data => {
        // console.log('Data: ', data);
        this.rows$ = data;
      });
  }

  onSelect(event: any) {}
}
