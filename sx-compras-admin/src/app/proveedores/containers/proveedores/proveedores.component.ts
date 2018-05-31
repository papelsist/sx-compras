import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Proveedor } from '../../models/proveedor';
import { ProveedoresService } from '../../services';

@Component({
  selector: 'sx-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {
  proveedores$: Observable<Proveedor[]>;
  constructor(private service: ProveedoresService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.proveedores$ = this.service.list();
  }
}
