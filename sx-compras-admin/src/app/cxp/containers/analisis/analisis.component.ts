import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';

import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Analisis } from '../../model/analisis';
import { Periodo } from 'app/_core/models/periodo';
import { AnalisisTableComponent } from '../../components';

@Component({
  selector: 'sx-analisis',
  templateUrl: './analisis.component.html',
  styles: [
    `
    .analisis-table-panel {
      min-height: 250px;
      max-height: 550px;
      overflow: auto;
    }
    .analisis-partidas-panel {
      min-height: 200px;
      max-height: 600px;
      overflow: auto;
    }
  `
  ]
})
export class AnalisisComponent implements OnInit {
  analisis$: Observable<Analisis[]>;
  selected: any;
  filtro: { proveedor?: string; periodo?: Periodo; factura?: string } = {};
  proveedor: string;
  periodo: Periodo;
  @ViewChild('table') table: AnalisisTableComponent;
  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {
    this.periodo = Periodo.monthToDay();
    this.analisis$ = this.store.select(fromStore.getAllAnalisis);
  }

  onSelect(event: Analisis[]) {
    this.selected = event;
  }

  onEdit(event: Analisis) {
    console.log('Editando: ', event);
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/analisis', event.id] }));
  }

  onSearch(event: string) {
    this.table.dataSource.filter = event;
  }
}
