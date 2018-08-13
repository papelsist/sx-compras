import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/notas.actions';
import * as fromAplicaciones from '../../store/actions/aplicaciones.actions';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core';

import { NotaDeCreditoCxP } from '../../model/notaDeCreditoCxP';
import { ComprobanteFiscalService } from '../../services';
import { AplicacionDePago } from '../../model';

@Component({
  selector: 'sx-nota',
  template: `
    <div *ngIf="nota$ | async as nota">
      <sx-nota-form [nota]="nota"
        (save)="onSave($event)"
        (delete)="onDelete($event)"
        (aplicar)="onAplicar($event)"
        (pdf)="onPdf($event)"
        (quitarAplicacion)="onQuitarAplicacion($event)">
      </sx-nota-form>
    </div>
  `
})
export class NotaComponent implements OnInit, OnDestroy {
  nota$: Observable<NotaDeCreditoCxP>;

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.nota$ = this.store.pipe(select(fromStore.getSelectedNota));
  }

  ngOnDestroy() {}

  onSave(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.UpdateNota(event));
  }

  onDelete(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.DeleteNota(event));
  }
  onCerrar(event: NotaDeCreditoCxP) {
    console.log('Cerrar: ', event);
  }

  onAplicar(event: NotaDeCreditoCxP) {
    this.dialogService
      .openConfirm({
        message: `Disponible $ ${event.disponible} `,
        title: 'Aplicar nota de crédito?',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.AplicarNota(event));
        }
      });
  }

  onQuitarAplicacion(event: AplicacionDePago) {
    this.dialogService
      .openConfirm({
        message: `Importe aplicado:   ${event.importe} `,
        title: 'Cancelar aplicación?',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromAplicaciones.DeleteAplicacionDePago(event)
          );
        }
      });
  }

  onPdf(event: NotaDeCreditoCxP) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }
}
