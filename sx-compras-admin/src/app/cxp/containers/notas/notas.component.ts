import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/notas.actions';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotaDeCreditoCxP } from '../../model';

import * as _ from 'lodash';
import { Periodo } from '../../../_core/models/periodo';
import { ComprobanteFiscalService } from '../../services';

@Component({
  selector: 'sx-notas-cxp',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.scss']
})
export class NotasComponent implements OnInit {
  loading$: Observable<boolean>;
  notas$: Observable<NotaDeCreditoCxP[]>;
  periodo$: Observable<Periodo>;
  totales: any = {};

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getNotasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDeNotas));
    this.notas$ = this.store.pipe(select(fromStore.getAllNotas));
  }

  onSelect(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/notas', event.id] }));
  }

  reload() {
    this.store.dispatch(new fromActions.LoadNotas());
  }

  getSucursales(object): string[] {
    return _.keys(object);
  }

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodoDeNotas({ periodo: event }));
  }

  onPdf(event: NotaDeCreditoCxP) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onXml(event: NotaDeCreditoCxP) {
    this.service.mostrarXml2(event.comprobanteFiscal.id).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }

  onTotales(event) {
    this.totales = event;
  }
}
