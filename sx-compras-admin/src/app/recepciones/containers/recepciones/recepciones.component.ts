import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRecepciones from '../../store/recepciones.selectors';
import * as fromActions from '../../store/recepciones.actions';

import { Observable } from 'rxjs';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';
import { Periodo } from 'app/_core/models/periodo';
import { RecepcionesService } from 'app/recepciones/services';
import { MatDialog } from '@angular/material';
import { ShowComsComponent } from 'app/recepciones/components';

@Component({
  selector: 'sx-recepciones',
  templateUrl: './recepciones.component.html',
  styleUrls: ['./recepciones.component.scss']
})
export class RecepcionesComponent implements OnInit {
  loading$: Observable<boolean>;
  periodo$: Observable<Periodo>;
  coms$: Observable<Partial<RecepcionDeCompra>[]>;
  selected: Partial<RecepcionDeCompra>[] = [];

  constructor(
    private store: Store<fromStore.State>,
    private service: RecepcionesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromRecepciones.getRecepcionesLoading)
    );
    this.periodo$ = this.store.pipe(select(fromRecepciones.selectPeriodo));
    this.coms$ = this.store.pipe(select(fromRecepciones.getAllRecepciones));
  }

  onSelect(event: RecepcionDeCompra[]) {}

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodo({ periodo: event }));
  }

  onReload() {
    this.store.dispatch(new fromActions.LoadRecepciones());
  }
  mostrarPartidas(coms: Partial<RecepcionDeCompra>[]) {
    const ids = coms.map(item => item.id);
    console.log('Mostrar partidas de :', ids);
    this.service
      .partidas(ids)
      .subscribe(
        res => this.showComs(res),
        error => console.error('Error: ', error)
      );
  }

  showComs(data: any[]) {
    this.dialog
      .open(ShowComsComponent, {
        data: { partidas: data }
      })
      .afterClosed()
      .subscribe(res => {});
  }
}
