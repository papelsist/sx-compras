import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Periodo } from 'app/_core/models/periodo';
import { PeriodoDialogComponent } from 'app/_shared/components';
import { CorteDeTarjetaService } from '../../services';

@Component({
  selector: 'sx-cortes-registrados',
  templateUrl: './cortes-registrados.component.html'
})
export class CortesRegistradosComponent implements OnInit, OnDestroy {
  procesando = false;
  periodo: Periodo = new Periodo();
  cortes$: Observable<Array<any>>;
  skey = 'cortes-tarjeta.cortes-registrados.periodo';

  constructor(
    private dialog: MatDialog,
    private service: CorteDeTarjetaService,
    private router: Router
  ) {}

  ngOnInit() {
    const json = localStorage.getItem(this.skey);
    if (json) {
      this.periodo = Periodo.parse(json);
    }
    this.load();
  }

  ngOnDestroy() {
    localStorage.setItem(this.skey, this.periodo.toJson());
  }

  selectPeriodo() {
    this.dialog
      .open(PeriodoDialogComponent, {
        data: { periodo: this.periodo }
      })
      .afterClosed()
      .subscribe(per => {
        if (per) {
          this.periodo = per;
          this.load();
        }
      });
  }

  load() {
    this.procesando = true;
    this.cortes$ = this.service
      .list({
        fechaInicial: this.periodo.fechaFinal.toISOString(),
        fechaFinal: this.periodo.fechaFinal.toISOString()
      })
      .pipe(finalize(() => (this.procesando = false)));
  }

  onSelect(corte) {
    // console.log('Corte: ', corte);
    this.router.navigate(['cortesTarjeta', corte.id]);
  }
}
