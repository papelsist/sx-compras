import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Proveedor } from '../../models/proveedor';
import { ProveedoresSearch } from '../../models/proveedorSearch';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'sx-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {
  proveedores$: Observable<Proveedor[]>;
  search$: Observable<ProveedoresSearch>;
  searchForm: FormGroup;

  constructor(
    private store: Store<fromStore.ProveedoresState>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.proveedores$ = this.store.pipe(
      select(fromStore.getFilteredProveedores)
    );
  }

  private buildForm() {
    this.searchForm = this.fb.group({
      term: '',
      activos: true,
      suspendidos: true
    });
    this.searchForm.valueChanges.pipe(debounceTime(600)).subscribe(value => {
      this.store.dispatch(new fromStore.SetSearchFilter(value));
    });
  }

  search(event: string) {
    // this.store.dispatch(new fromStore.SetSearchFilter(event));
  }

  onSelect(event: Proveedor) {
    this.store.dispatch(new fromRoot.Go({ path: ['proveedores', event.id] }));
  }
}
