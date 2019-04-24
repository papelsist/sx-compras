import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';

import { Observable } from 'rxjs';
import { User } from 'app/auth/models/user';
import { MatDialog } from '@angular/material';
import {
  EntregasPorChoferDialogComponent,
  ComisionesPorFacturistaDialogComponent,
  AnalisisDeEmbarquesDialogComponent
} from 'app/control-de-embarques/components';

import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-embarques-page',
  templateUrl: './embarques-page.component.html',
  styleUrls: ['./embarques-page.component.scss']
})
export class EmbarquesPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'comisiones',
      title: 'Comisiones',
      description: 'Comisiones sobre envios',
      icon: 'account_balance_wallet'
    },
    {
      route: 'prestamos',
      title: 'Prestamos',
      description: 'Prestamos a choferes',
      icon: 'receipt'
    },
    {
      route: 'cargos',
      title: 'Cargos',
      description: 'Cargos diversos a choferes',
      icon: 'gradient'
    },
    {
      route: 'estadoDeCuenta',
      title: 'Estado de cuenta',
      description: '',
      icon: 'account_box'
    }
  ];

  user$: Observable<User>;
  api$: Observable<any>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private service: ReportService
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
  }

  reporteDeEntrgasPorChofer() {
    this.dialog
      .open(EntregasPorChoferDialogComponent, {
        data: {},
        width: '600px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Run report: ', res);
          this.service.runReport('embarques/comisiones/entregasPorChofer', res);
        }
      });
  }
  comisionesPorFacturista() {
    this.dialog
      .open(ComisionesPorFacturistaDialogComponent, {
        data: {},
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Run report: ', res);
          this.service.runReport(
            'embarques/comisiones/comisionesPorFacturista',
            res
          );
        }
      });
  }

  analisisDeEmbarque() {
    this.dialog
      .open(AnalisisDeEmbarquesDialogComponent, {
        data: {},
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Run report: ', res);
          this.service.runReport(
            'embarques/comisiones/analisisDeEmbarque',
            res
          );
        }
      });
  }
}
