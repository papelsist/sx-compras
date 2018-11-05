import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { MatDialog } from '@angular/material';

import { CorteDeTarjetaService } from '../../services';
import { RepComisionTarjetasComponent } from '../../components';

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
    private dialog: MatDialog
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
        this.service
          .reporteDeComisionesTarjeta(res.sucursal, res.fecha)
          .subscribe(
            pdf => {
              const blob = new Blob([pdf], {
                type: 'application/pdf'
              });
              const fileURL = window.URL.createObjectURL(blob);
              window.open(fileURL, '_blank');
            },
            error2 => console.log(error2)
          );
      }
    });
  }
}
