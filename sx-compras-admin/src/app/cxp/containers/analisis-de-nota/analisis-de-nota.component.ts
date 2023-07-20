import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable, Subject, of, from } from 'rxjs';

import { TdDialogService } from '@covalent/core';
import { NotaDeCreditoCxP, AnalisisDeNota } from 'app/cxp/model';
import {
  takeUntil,
  delay,
  concatMap,
  finalize,
  reduce,
  map
} from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { SelectorDeDecsComponent } from 'app/cxp/components';
import { AnalisisDeNotaService } from 'app/cxp/services/analisis-de-nota.service';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { Update } from '@ngrx/entity';

import * as _ from 'lodash';

@Component({
  selector: 'sx-analisis-de-nota',
  templateUrl: './analisis-de-nota.component.html',
  styleUrls: ['./analisis-de-nota.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalisisDeNotaComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  nota$: Observable<NotaDeCreditoCxP>;
  analisis$: Observable<AnalisisDeNota[]>;
  analizado$: Observable<number>;

  selected: AnalisisDeNota[] = [];

  destroy$ = new Subject<boolean>();

  constructor(
    private store: Store<fromStore.CxpState>,
    private dialog: MatDialog,
    private service: AnalisisDeNotaService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.selectAnalisisDeNotaLoading)
    );
    this.nota$ = this.store.pipe(select(fromStore.getSelectedNota));
    this.analisis$ = this.store.pipe(select(fromStore.selectAnalisisDeNota));
    this.nota$.pipe(takeUntil(this.destroy$)).subscribe(nota => {
      if (nota) {
        this.store.dispatch(
          new fromStore.LoadAnalisisDeNota({ notaId: nota.id })
        );
      }
    });
    this.analizado$ = this.analisis$.pipe(
      map(items => _.sumBy(items, 'importe'))
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  agregarPartidas(nota: Partial<NotaDeCreditoCxP>) {
    this.service
      .devolucionesPendientes(nota.proveedor.id)
      .subscribe(
        res => this.doSelectPartidas(nota, res),
        error => console.error('Error: ', error)
      );
  }

  private doSelectPartidas(nota: Partial<NotaDeCreditoCxP>, decs: any[]) {
    this.dialog
      .open(SelectorDeDecsComponent, {
        data: { decs },
        width: '850px'
      })
      .afterClosed()
      .subscribe((res: any[]) => {
        if (res) {
          this.insertRows(nota, res);
        }
      });
  }

  private insertRows(nota: Partial<NotaDeCreditoCxP>, res: any[]) {
    from(res)
      .pipe(
        concatMap(item => of(item).pipe(delay(1000))), // Small delay
        finalize(() => (this.selected = []))
      )
      .subscribe(item => {
        const analisis: Partial<AnalisisDeNota> = {
          ...item
        };
        this.store.dispatch(
          new fromStore.CreateAnalisisDeNota({
            notaId: nota.id,
            analisis
          })
        );
      });
  }

  back() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSelect(event: any) {
    // console.log('Selected: ', event);
  }

  onSelectionChange(event: AnalisisDeNota[]) {
    this.selected = event;
  }

  onUpdate(nota: Partial<NotaDeCreditoCxP>, event: AnalisisDeNota) {
    const { id, costo } = event;
    const analisis: Update<AnalisisDeNota> = {
      id,
      changes: { costo: costo }
    };
    this.store.dispatch(
      new fromStore.UpdateAnalisisDeNota({ notaId: nota.id, analisis })
    );
    this.selected = [];
  }

  onDeleteAnalisis(nota: Partial<NotaDeCreditoCxP>, rows: AnalisisDeNota[]) {
    from(rows)
      .pipe(
        concatMap(item => of(item.id).pipe(delay(1000))), // Small delay
        finalize(() => (this.selected = []))
      )
      .subscribe(analisisId =>
        this.store.dispatch(
          new fromStore.DeleteAnalisisDeNota({ notaId: nota.id, analisisId })
        )
      );
  }

  cerrarAnalisis(nota: NotaDeCreditoCxP) {
    if (!nota.cierreDeAnalisis) {
      this.dialogService
        .openConfirm({
          title: 'CIERRE DE ANALSIS',
          message: `CERRAR ANALSIS:  ${nota.folio}`,
          acceptButton: 'CERRAR',
          cancelButton: 'CANCELAR'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            // const data: Update<NotaDeCreditoCxP> = {id: nota.id, changes: {cierreDeAnalisis: new Date().toISOString()}};
            nota.cierreDeAnalisis = new Date().toISOString();
            this.service.cerrarAnalisis(nota.id).subscribe(
              (nx: NotaDeCreditoCxP) => {
                this.store.dispatch(new fromStore.UpsertNota({ nota: nx }));
              },
              error => console.error('Error cerrando analisis: ', error)
            );
          }
        });
    }
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
