import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';
import { AuthSession } from '../../../auth/models/authSession';
import { User } from 'app/auth/models/user';

import { Observable } from 'rxjs';

import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-movimientos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimientos-page.component.html'
})
export class MovimientosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'depositosRetiros',
      title: 'Depósito/Retiro',
      description: 'Depositos y retiros',
      icon: 'import_export'
    },
    {
      route: 'comisiones',
      title: 'Comisiones ',
      description: 'Comisiones bancarias',
      icon: 'filter_none'
    },
    {
      route: 'traspasos',
      title: 'Traspasos ',
      description: 'Traspaso entre cuentas',
      icon: 'swap_horiz'
    },
    {
      route: 'inversiones',
      title: 'Inversiones ',
      description: 'Inversiones',
      icon: 'file_upload'
    },
    {
      route: 'devolucion',
      title: 'Devoluciones',
      description: 'Devoluciones a cliente',
      icon: ''
    }
  ];

  loading$: Observable<boolean>;
  session$: Observable<AuthSession>;
  user$: Observable<User>;
  api$: Observable<any>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.session$ = this.store.pipe(select(fromAuth.getSession));
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
  }
}
