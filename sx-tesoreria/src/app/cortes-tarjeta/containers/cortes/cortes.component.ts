import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { MatDialog } from '@angular/material';

import { CorteDeTarjetaService } from '../../services';
import { RepComisionTarjetasComponent } from '../../components';
import { ReportService } from 'app/reportes/services/report.service';

@Component({
  selector: 'sx-cortes',
  templateUrl: './cortes.component.html'
})
export class CortesComponent implements OnInit {
  navmenu: Object[] = [
    {
      icon: 'credit_card',
      route: 'pendientes',
      title: 'Pendientes',
      description: 'Cobros con tarjeta'
    },
    {
      icon: 'account_balance_wallet',
      route: 'registrados',
      title: 'Registrados',
      description: 'Cortes de tarjeta'
    }
  ];
  constructor(
    public media: TdMediaService,
    private service: CorteDeTarjetaService,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  sucursales: any[];

  ngOnInit() {
    this.service.sucursales().subscribe(data => (this.sucursales = data));
  }

  comisionesTarjeta() {
    const dialogRef = this.dialog.open(RepComisionTarjetasComponent, {
      data: { sucursales: this.sucursales }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.reportService.runReport(
          'tesoreria/cortesTarjeta/reporteDeComisionesTarjeta',
          { sucursal: res.sucursal, fecha: res.fecha.toISOString() }
        );
      }
    });
  }
}
