import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  FacturistaDeEmbarque,
  FacturistaPrestamo
} from 'app/control-de-embarques/model';
import { ConfigService } from 'app/utils/config.service';

@Component({
  selector: 'sx-facturista-field2',
  template: `
  <ng-container [formGroup]="parent" >
    <mat-form-field class="fill">
      <mat-select placeholder="Facturista" [formControlName]="propertyName" [compareWith]="compareWith">
        <mat-option *ngFor="let item of facturistas " [value]="item">
          {{item.nombre}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </ng-container>
  `,
  styles: [
    `
      .fill {
        width: 100%;
      }
    `
  ]
})
export class FacturistasField2Component implements OnInit {
  @Input()
  parent: FormGroup;

  @Input()
  propertyName = 'facturista';

  facturistas: FacturistaDeEmbarque[];
  private apiUrl: string;

  constructor(private configService: ConfigService, private http: HttpClient) {
    this.apiUrl = configService.buildApiUrl('embarques/facturistas');
  }

  ngOnInit() {
    this.load();
  }

  load() {
    const params = new HttpParams().set('max', '1000').set('sort', 'nombre');
    this.http
      .get<FacturistaDeEmbarque[]>(this.apiUrl, { params: params })
      .subscribe(
        res => (this.facturistas = res),
        error => console.log('Error cargando facturistas: ', error)
      );
  }

  compareWith(item1: FacturistaPrestamo, item2: FacturistaPrestamo) {
    if (item2) {
      return item1.id === item2.id;
    }
    return false;
  }
}
