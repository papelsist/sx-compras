import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Analisis } from '../../model/analisis';
import { Periodo } from 'app/_core/models/periodo';
import { AnalisisTableComponent } from '../../components';
import { pluck } from 'rxjs/operators';

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
  periodo$: Observable<Periodo>;
  tipo$: Observable<string>;
  @ViewChild('table') table: AnalisisTableComponent;

  constructor(private store: Store<fromStore.CxpState>) {}

  ngOnInit() {
    this.analisis$ = this.store.select(fromStore.getFilteredAnalisis);
    this.periodo$ = this.store.pipe(select(fromStore.getAnalisisPeriodo));
    this.tipo$ = this.store.pipe(
      select(fromStore.getAnalisisFilter),
      pluck('tipo')
    );
  }

  onSelect(event: Analisis[]) {
    this.selected = event;
  }

  onEdit(event: Analisis) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/analisis', event.id] }));
  }

  onSearch(event: string) {
    this.table.dataSource.filter = event.toLowerCase();
  }

  onPeriodo(event: Periodo) {
    if (event) {
      this.store.dispatch(new fromStore.SetAnalisisPeriodo(event));
    }
  }

  onTipo(event: string) {
    this.store.dispatch(new fromStore.SetSearchFilter({ tipo: event }));
  }
}
