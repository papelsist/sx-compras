import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';

@Component({
  selector: 'sx-facturista',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="facturista$ | async as facturista">
      <!--
      <sx-nota-form [nota]="nota"
        (save)="onSave($event)"
        (delete)="onDelete($event)"
        (aplicar)="onAplicar($event)"
        (pdf)="onPdf($event)"
        (xml)="onXml($event)"
        [cuentasPorPagar]="facturasPendientes$ | async"
        (agregarAplicaciones)="onAgregarAplicacion(nota, $event)"
        (quitarAplicacion)="onQuitarAplicacion($event)">
      </sx-nota-form>
      -->
      Fac: {{facturista | json}}
    </div>
  `
})
export class FacturistaComponent implements OnInit {
  facturista$: Observable<FacturistaDeEmbarque>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getFacturistasLoading));
    this.facturista$ = this.store.pipe(select(fromStore.getCurrentFacturista));
  }
}
