import { of as observableOf, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sx-home-page',
  templateUrl: './home-page.component.html',
  styles: []
})
export class HomePageComponent implements OnInit {
  header$: Observable<string>;
  application$: Observable<any>;

  constructor() {}

  ngOnInit() {
    this.header$ = observableOf('SX-Compras');
    this.application$ = observableOf({
      name: 'SX POS-COMPRAS',
      descripcion: 'SIIPAPX compras de materia prima',
      image: '/assets/images/logo_papelsa.jpg'
    });
  }
}
