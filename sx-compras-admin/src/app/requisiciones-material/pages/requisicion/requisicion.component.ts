import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  withLatestFrom,
  switchMap,
  takeUntil,
  filter,
  tap,
  pluck
} from 'rxjs/operators';

import { RequisicionDeMaterial, RequisicionDeMaterialDet } from '../../models';
import { ProductosSelectorService } from 'app/proveedores/productos-selector/productos-selector.service';
import { RequisicionDeMaterialService } from '../../services/requisicion-de-material.service';
import { RequisicionPartidasComponent } from '../../components/requisicion-partidas/requisicion-partidas.component';
import { Update } from '@ngrx/entity';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-requisicion',
  templateUrl: './requisicion.component.html',
  styleUrls: ['./requisicion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  requisicion$: Observable<RequisicionDeMaterial>;

  disponibles: any[] = [];
  selectedPartidas: any[] = [];

  destroy$ = new Subject<boolean>();
  dirty$ = new BehaviorSubject<boolean>(false);

  requisicion: RequisicionDeMaterial;
  partidas: Partial<RequisicionDeMaterialDet>[] = [];

  @ViewChild('grid') grid: RequisicionPartidasComponent;

  roles: string[] = [];

  constructor(
    private store: Store<fromStore.State>,
    private selector: ProductosSelectorService,
    private service: RequisicionDeMaterialService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.selectRequisicionesLoading)
    );
    this.requisicion$ = this.store.pipe(
      select(fromStore.getCurrentRequisicion)
    );

    this.requisicion$
      .pipe(
        filter(item => !!item),
        takeUntil(this.destroy$)
      )
      .subscribe(r => {
        console.log('Req: ', r);
        this.requisicion = r;
        this.partidas = r.partidas || [];
        this.cargarDisponibles(r);
      });
    this.store
      .pipe(
        select(fromAuth.getSession),
        pluck('roles'),
        takeUntil(this.destroy$)
      )
      .subscribe(r => {
        this.roles = r;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  cargarDisponibles(r: RequisicionDeMaterial) {
    this.service
      .disponibles(r.clave)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.disponibles = data;
      });
  }

  agregarPartidas() {
    this.selector
      .opneSelection(this.disponibles)
      .afterClosed()
      .subscribe((selected: any[]) => {
        if (selected) {
          const rows = selected.map(item => {
            return {
              producto: item.clave,
              descripcion: item.descripcion,
              unidad: item.unidad,
              solicitado: 0.0,
              comentario: ''
            };
          });
          this.partidas = [...this.partidas, ...rows];
          this.grid.setRowData(this.partidas);
          this.dirty$.next(true);
        }
      });
  }

  back() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSave() {
    const changes = {
      partidas: this.grid.getAllRows()
    };
    const update: Update<RequisicionDeMaterial> = {
      id: this.requisicion.id,
      changes
    };
    console.log('Save data: ', update);
    this.dirty$.next(false);
    this.store.dispatch(new fromStore.UpdateRequisicionDeMaterial({ update }));
  }

  onSelect(event: any) {
    console.log('Selected: ', event);
  }

  onDelete(event: Partial<RequisicionDeMaterial>) {
    this.dialogService
      .openConfirm({
        title: 'ELIMINAR REQUISICION DE MATERIAL',
        message: 'FOLIO: ' + event.folio,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.DeleteRequisicionDeMaterial({ requisicion: event })
          );
        }
      });
  }

  onGenerarCompra(event: Partial<RequisicionDeMaterial>) {
    if (!event.compra) {
      this.dialogService
        .openConfirm({
          title: 'GENERAR ORDEN DE COMPRA',
          message: 'REQUISICION: ' + event.folio,
          acceptButton: 'ACEPTAR',
          cancelButton: 'CANCELAR'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            this.store.dispatch(
              new fromStore.GenerarCompraDeMaterial({ requisicion: event })
            );
          }
        });
    }
  }

  @HostListener('document:keydown.meta.i', ['$event'])
  onHotKeyInsert(event) {
    this.agregarPartidas();
  }
  @HostListener('document:keydown.insert', ['$event'])
  onHotKeyInsert2(event) {
    this.agregarPartidas();
  }

  hasAdminRole(): boolean {
    return this.roles.includes('ROLE_ADMIN');
  }
}
