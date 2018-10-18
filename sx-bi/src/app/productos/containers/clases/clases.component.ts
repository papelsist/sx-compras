import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromClases from '../../store/actions/clases.actions';

import { Observable } from 'rxjs';

import { Clase } from '../../models/clase';
import { ClaseFormComponent } from '../../components';

@Component({
  selector: 'sx-clases',
  templateUrl: './clases.component.html',
  styles: [``]
})
export class ClasesComponent implements OnInit {
  clases$: Observable<Clase[]>;

  constructor(
    private store: Store<fromStore.CatalogosState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.clases$ = this.store.select(fromStore.getAllClases);
  }

  onSelect(clase) {
    console.log('Select: ', clase);
  }

  onCreate() {
    this.onEdit(null);
  }

  onEdit(clase: Partial<Clase>) {
    this.dialog
      .open(ClaseFormComponent, {
        data: { clase: clase },
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const target = {
            ...clase,
            ...res
          };
          if (target.id) {
            this.store.dispatch(new fromClases.UpdateClase(target));
          } else {
            this.store.dispatch(new fromClases.CreateClase(target));
          }
        }
      });
  }

  onDelete(event: Clase) {}
}
