import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CuentaPorPagar } from 'app/cxp/model';

@Component({
  selector: 'sx-cxp-gasto-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-gasto-selector.component.html',
  styleUrls: ['./cxp-gasto-selector.component.scss']
})
export class CxpGastoSelectorComponent implements OnInit {
  conceptos: any[];
  selected: any[] = [];
  cxp: Partial<CuentaPorPagar>;

  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CxpGastoSelectorComponent>,
    private fb: FormBuilder
  ) {
    this.conceptos = data.conceptos;
    this.cxp = data.cxp;
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      sucursal: [
        {
          id: '402880fc5e4ec411015e4ec64161012c',
          cave: '1',
          nombre: 'OFICINAS'
        },
        [Validators.required]
      ]
    });
  }

  onSelection(event: any[]) {
    this.selected = event;
  }

  asignar() {
    const { sucursal } = this.form.value;
    const gastos = this.selected.map(item => {
      return {
        cxp: this.cxp.id,
        sucursal: sucursal.id,
        sucursalNombre: sucursal.nombre,
        descripcion: item.descripcion,
        cfdiDet: item.id,
        cfdiUnidad: item.unidad,
        cfdiDescripcion: item.descripcion,
        claveProdServ: item.claveProdServ,
        cantidad: item.cantidad,
        valorUnitario: item.valorUnitario,
        importe: item.importe,
        descuento: item.descuento,
        isrRetenido: item.isrRetenido || 0.0,
        isrRetenidoTasa: item.isrRetenidoTasa || 0.0,
        ivaRetenido: item.ivaRetenido || 0.0,
        ivaRetenidoTasa: item.ivaRetenidoTasa || 0.0,
        ivaTrasladado: item.ivaTrasladado || 0.0,
        ivaTrasladadoTasa: item.ivaTrasladadoTasa || 0.0
      };
    });
    this.dialogRef.close(gastos);
  }
}
