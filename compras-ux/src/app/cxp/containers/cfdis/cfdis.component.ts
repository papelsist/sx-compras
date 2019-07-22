import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { shareReplay, finalize } from 'rxjs/operators';

import { ComprobanteFiscalService } from '../../services';
import { ComprobanteFiscal } from '../../model/comprobanteFiscal';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-cxp-cfdis',
  templateUrl: './cfdis.component.html',
  styleUrls: ['./cfdis.component.scss']
})
export class CfdisComponent implements OnInit, OnDestroy {
  cfdis$: Observable<ComprobanteFiscal[]>;
  periodo: Periodo;

  loading$ = new BehaviorSubject<boolean>(false);
  storeKey = 'sx-compras.cfdis.periodo';
  totales: any = {};
  constructor(private service: ComprobanteFiscalService) {}

  ngOnInit() {
    this.periodo = Periodo.fromStorage(this.storeKey);
    this.load();
  }

  load() {
    this.loading$.next(true);
    this.cfdis$ = this.service
      .list({ ...this.periodo.toApiJSON() })
      .pipe(finalize(() => this.loading$.next(false)));
  }

  cambiarPeriodo(event: Periodo) {
    if (event) {
      this.periodo = event;
      Periodo.saveOnStorage(this.storeKey, this.periodo);
      this.load();
    }
  }

  ngOnDestroy() {}

  onPdf(event: ComprobanteFiscal) {
    this.service.imprimirCfdi(event.id);
  }

  onXml(event: ComprobanteFiscal) {
    this.service.mostrarXml(event).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }

  onSelect(event: ComprobanteFiscal[]) {}

  onTotales(event: any) {
    this.totales = event;
  }
}
