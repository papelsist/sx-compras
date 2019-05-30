import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';
import * as fromCartera from 'app/cobranza/store';

import { Observable } from 'rxjs';
import { User } from 'app/auth/models/user';
import { ReportService } from 'app/reportes/services/report.service';
import { FechaDialogComponent } from 'app/_shared/components';
import { MatDialog } from '@angular/material';

import { Cartera } from 'app/cobranza/models';

@Component({
  selector: 'sx-credito-page',
  templateUrl: './credito-page.component.html',
  styleUrls: ['./credito-page.component.scss']
})
export class CreditoPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'cobros',
      title: 'Cobros',
      icon: 'attach_money',
      description: 'Cobros y aplicaciones'
    },
    {
      route: 'solicitudes',
      title: 'Depositos',
      icon: 'event_available',
      description: 'Solicitudes de deposito'
    },
    {
      route: 'notas/bonificaciones',
      title: 'Bonificaciones',
      description: 'Notas de bonificación',
      icon: 'B'
    },
    {
      route: 'notas-de-cargo',
      title: 'N.Cargo',
      icon: 'queue',
      description: 'Notas de cargo'
    }
  ];

  user$: Observable<User>;
  api$: Observable<any>;

  cartera$: Observable<Cartera>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>,
    private service: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
    this.cartera$ = this.store.pipe(select(fromCartera.getCartera));
  }

  reporteDeCobranza() {
    const dialogRef = this.dialog.open(FechaDialogComponent, {
      data: { title: `Reporte de cobranza Credito` }
    });
    dialogRef.afterClosed().subscribe(fecha => {
      if (fecha) {
        this.service.runReport('cxc/cobro/reporteDeCobranza', {
          fecha,
          cartera: 'CHO'
        });
      }
    });
  }
}
