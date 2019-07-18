import { Component, OnInit, Input } from '@angular/core';
import { NotaDeCredito, Bonificacion, Devolucion } from 'app/cobranza/models';

@Component({
  selector: 'sx-aplicaciones-nota',
  template: `
    <mat-accordion
      class="example-headers-align"
      *ngIf="nota.aplicaciones && nota.aplicaciones.length > 0"
    >
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            Aplicaciones
          </mat-panel-title>
          <mat-panel-description>
            Registro de aplicaciones
          </mat-panel-description>
        </mat-expansion-panel-header>

        <mat-list>
          <mat-list-item *ngFor="let item of nota.aplicaciones">
            Factura: {{ item.cuentaPorCobrar.tipo }} -
            {{ item.folioDocumento }} Pagos:
            {{ item.cuentaPorCobrar.pagos }} Saldo:
            {{ item.cuentaPorCobrar.saldoReal }}
            <mat-divider inset></mat-divider>
          </mat-list-item>
        </mat-list>
      </mat-expansion-panel>
    </mat-accordion>
  `
})
export class AplicacionesNotaComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  constructor() {}

  ngOnInit() {}
}
