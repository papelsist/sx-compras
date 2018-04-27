import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
    this.header$ = Observable.of('SX-Compras');
    this.application$ = Observable.of({
      name: 'SX POS-COMPRAS',
      descripcion: 'SIIPAPX compras de materia prima',
      image: '/assets/images/logo_papelsa.jpg'
    });
  }
}
