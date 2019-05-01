import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { NotaDeCargo } from 'app/cobranza/models';
import { CfdiService } from 'app/cobranza/services/cfdi.service';
import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-nota-de-cargo',
  templateUrl: './nota-de-cargo.component.html',
  styleUrls: ['./nota-de-cargo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotaDeCargoComponent implements OnInit {
  nota$: Observable<NotaDeCargo>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private service: CfdiService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getNotasDeCargoLoading));
    this.nota$ = this.store.pipe(select(fromStore.getSelectedNotaDeCargo));
  }

  imprimirCfdi(nota: NotaDeCargo) {
    if (nota.cfdi && nota.cfdi.uuid) {
      this.reportService.runReport(`cfdi/print/${nota.cfdi.id}`, {});
    }
  }

  mandarPorCorreo(nota: NotaDeCargo) {}

  mostrarXml(nota: NotaDeCargo) {
    if (nota.cfdi && nota.cfdi.uuid) {
      this.service.mostrarXml(nota.cfdi.id);
    }
  }

  goBack() {
    this.store.dispatch(new fromRoot.Back());
  }
}
