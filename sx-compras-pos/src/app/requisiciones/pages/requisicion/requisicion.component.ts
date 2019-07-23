import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { Observable } from 'rxjs';
import { RequisicionDeMaterial } from 'app/requisiciones/models';

import { ProductosSelectorService } from 'app/proveedores/productos-selector/productos-selector.service';
import { RequisicionDeMaterialService } from 'app/requisiciones/services/requisicion-de-material.service';
import { withLatestFrom, switchMap } from 'rxjs/operators';

@Component({
  selector: 'sx-requisicion',
  templateUrl: './requisicion.component.html',
  styleUrls: ['./requisicion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionComponent implements OnInit {
  loading$: Observable<boolean>;
  requisicion$: Observable<RequisicionDeMaterial>;
  disponibles: any[] = [];

  constructor(
    private store: Store<fromStore.State>,
    private selector: ProductosSelectorService,
    private service: RequisicionDeMaterialService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(
      select(fromStore.selectRequisicionesLoading)
    );
    this.requisicion$ = this.store.pipe(
      select(fromStore.getCurrentRequisicion)
    );

    this.requisicion$.subscribe(r => {
      this.cargarDisponibles(r);
    });
  }

  cargarDisponibles(r: RequisicionDeMaterial) {
    this.service.disponibles(r.clave).subscribe(data => {
      this.disponibles = data;
    });
  }

  agregarPartidas() {
    console.log('Agregar partidas disponibles', this.disponibles.length);
    this.selector
      .opneSelection(this.disponibles)
      .afterClosed()
      .subscribe(selected => console.log('Selected:', selected));
  }

  back() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSelect(event: any) {
    console.log('Selected: ', event);
  }

  @HostListener('document:keydown.meta.i', ['$event'])
  onHotKeyInsert(event) {
    this.agregarPartidas();
  }
  @HostListener('document:keydown.insert', ['$event'])
  onHotKeyInsert2(event) {
    this.agregarPartidas();
  }
}
