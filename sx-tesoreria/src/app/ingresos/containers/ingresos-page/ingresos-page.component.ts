import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { ReportService } from 'app/reportes/services/report.service';
import { MatDialog } from '@angular/material';
import { RelacionPagosComponent } from 'app/reportes/components/relacion-pagos.component';

@Component({
  selector: 'sx-ingresos-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresos-page.component.html',
  styles: [
    `
      .document {
        width: 100%;
        height: 100%;
      }
    `
  ]
})
export class IngresosPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'cobros',
      title: 'Cobros',
      description: 'Registro de cobros',
      icon: 'attach_money'
    },
    {
      route: 'chequesdevueltos',
      title: 'Cheques DEV',
      description: 'Cheques devueltos',
      icon: 'settings_backup_restore'
    },
    {
      route: 'fichas',
      title: 'Fichas',
      description: 'Alta de fichas',
      icon: 'filter_none'
    },
    {
      route: 'fichasContado',
      title: 'Fichas (CON)',
      description: 'Fichas de  contado',
      icon: 'my_library_books'
    }
  ];

  loading$: Observable<boolean>;

  constructor(
    public media: TdMediaService,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  reporteDeCobros() {
    this.dialog
      .open(RelacionPagosComponent, { data: {} })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log('Run report: ', res);
          this.reportService.runReport(
            'cxc/cobro/reporteDeRelacionDePagos',
            res
          );
        }
      });
  }
}
