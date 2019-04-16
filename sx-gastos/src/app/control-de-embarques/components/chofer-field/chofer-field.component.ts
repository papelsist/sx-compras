import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { ConfigService } from 'app/utils/config.service';
import { Chofer } from 'app/control-de-embarques/model';

@Component({
  selector: 'sx-chofer-field',
  templateUrl: './chofer-field.component.html'
})
export class ChoferFieldComponent implements OnInit, OnDestroy {
  apiUrl: string;

  @Input()
  parent: FormGroup;

  @Input()
  choferProperty = 'chofer';

  @Input()
  placeholder = 'Chofer';

  choferes: Chofer[];

  private subscription: Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('choferes');
  }

  ngOnInit() {
    this.subscription = this.buscar().subscribe(
      choferes => (this.choferes = choferes)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  buscar(): Observable<Chofer[]> {
    return this.http.get<Chofer[]>(this.apiUrl, {
      params: new HttpParams()
        .set('max', '100')
        .set('sort', 'nombre')
        .set('order', 'asc')
    });
  }

  compareFn(c1: Chofer, c2: Chofer): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
