import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    Output,
    EventEmitter,
    OnDestroy
  } from '@angular/core';
  import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
  import { Subscription } from 'rxjs';

  @Component({
    selector: 'sx-cotizaciones-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './cotizaciones-table.component.html',
    styleUrls: ['./cotizaciones-table.component.scss']
  })
  export class CotizacionesTableComponent implements OnInit, OnChanges, OnDestroy {
    
    @Input() cotizaciones: any[] = [];
    @Input() multipleSelection = true;
    @Input() filter;
    @Output() select = new EventEmitter();
    @Output() edit = new EventEmitter();
    subscription: Subscription;
    dataSource = new MatTableDataSource<any>([]);

    displayColumns = [
        'documento',
        'fecha',
        'nombre',
       /*  'productoOrigen',
        'metros',
        'productoDestino',
        'comentario',
        'piezas', */
      ];

      @ViewChild(MatSort) sort: MatSort;

      constructor() {}

      ngOnInit() {
        this.dataSource.sort = this.sort;

        this.subscription = this.sort.sortChange.subscribe(e =>
          localStorage.setItem('sx-cotizaciones.coms-table.sort', JSON.stringify(e))
        );

        const sdata: string = localStorage.getItem('sx-cotizaciones.coms-table.sort');
        if (sdata) {
          const data: {
            active: string;
            direction: 'asc' | 'desc' | '';
          } = JSON.parse(sdata);
          this.sort.active = data.active;
          this.sort.direction = data.direction;
        } else {
          this.sort.active = 'documento';
          this.sort.direction = 'desc';
        }
      }
      ngOnChanges() {}
      ngOnDestroy() {}
      /*


  

  
    
  
  
    ngOnInit() {
      this.dataSource.sort = this.sort;
  
      this.subscription = this.sort.sortChange.subscribe(e =>
        localStorage.setItem('sx-compras.coms-table.sort', JSON.stringify(e))
      );
  
      const sdata: string = localStorage.getItem('sx-compras.coms-table.sort');
      if (sdata) {
        const data: {
          active: string;
          direction: 'asc' | 'desc' | '';
        } = JSON.parse(sdata);
        this.sort.active = data.active;
        this.sort.direction = data.direction;
      } else {
        this.sort.active = 'documento';
        this.sort.direction = 'desc';
      }
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes.coms && changes.coms.currentValue) {
        this.dataSource.data = changes.coms.currentValue;
      }
      if (changes.filter) {
        this.dataSource.filter = changes.filter.currentValue;
      }
    }
  
    ngOnDestroy() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  
    applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
  
    onEdit($event: Event, row) {
      $event.preventDefault();
      this.edit.emit(row);
    }
  
    getPrintUrl(event: RecepcionDeCompra) {
      return `coms/print/${event.id}`;
    }
    */
  }
