import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TdDialogService } from '@covalent/core';

import { CorteDeTarjetaService } from '../../services';

@Component({
  selector: 'sx-corte',
  template: `
    <div layout>
    <ng-template tdLoading [tdLoadingUntil]="!procesando" tdLoadingStrategy="overlay" >
      <sx-corte-tarjeta-form [corte]="corte" (cancelar)="regresar()" (cancelarAplicacion)="onCancelarAplicacion($event)"
        (aplicar)="onAplicar($event)" (eliminar)="onDelete($event)" flex="65">
      </sx-corte-tarjeta-form>
    </ng-template>
    </div>
  `
})
export class CorteComponent implements OnInit {
  corte: any;
  procesando = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CorteDeTarjetaService,
    private dialogServie: TdDialogService
  ) {}

  ngOnInit() {
    this.corte = this.route.snapshot.data.corte;
  }

  regresar() {
    this.router.navigate(['../registrados'], { relativeTo: this.route });
  }

  onAplicar(corte) {
    this.procesando = true;
    this.service
      .aplicar(corte)
      .pipe(finalize(() => (this.procesando = false)))
      .subscribe(del => this.regresar());
  }

  onDelete(corte) {
    this.dialogServie
      .openConfirm({
        title: 'Corte de tarjeta ',
        message: 'Eliminar este corte de tarjeta',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.procesando = true;
          this.service
            .delete(corte.id)
            .pipe(finalize(() => (this.procesando = false)))
            .subscribe(del => this.regresar());
        }
      });
  }

  onCancelarAplicacion(corte) {
    this.dialogServie
      .openConfirm({
        title: 'Corte de tarjeta ',
        message: 'Cancelar aplicacion de este corte de tarjeta',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.procesando = true;
          this.service
            .cancelarAplicacion(corte)
            .pipe(finalize(() => (this.procesando = false)))
            .subscribe(del => this.regresar());
        }
      });
  }
}
