import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LineasService } from '../../services';

@Component({
  selector: 'sx-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})
export class LineasComponent implements OnInit {
  dataSource = new MatTableDataSource([]);
  columns = ['linea'];

  constructor(private service: LineasService) {}

  ngOnInit() {
    this.service.list({}).subscribe(data => (this.dataSource.data = data));
  }
}
