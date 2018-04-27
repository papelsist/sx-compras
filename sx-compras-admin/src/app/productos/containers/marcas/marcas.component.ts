import { Component, OnInit } from '@angular/core';
import { Marca } from '../../models/marca';
import { MarcasService } from '../../services/marcas/marcas.service';

@Component({
  selector: 'sx-marcas',
  templateUrl: './marcas.component.html',
  styles: [
    `.marcas-container {
        display: flex;
        flex-direction: column;
        min-width: 300px;
      }
    .mat-list {
      overflow: auto;
      max-height: 400px;
    }
    `
  ]
})
export class MarcasComponent implements OnInit {
  marcas: Marca[];

  constructor(private service: MarcasService) {}

  ngOnInit() {
    this.service.list({}).subscribe(marcas => (this.marcas = marcas));
  }
}
