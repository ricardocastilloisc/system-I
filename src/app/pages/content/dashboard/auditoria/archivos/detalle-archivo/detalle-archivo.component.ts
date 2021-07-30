import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { S3Service } from '../../../../../../services/s3.service';
declare var Handsontable: any;


@Component({
  selector: 'app-detalle-archivo',
  templateUrl: './detalle-archivo.component.html',
  styleUrls: ['./detalle-archivo.component.css']
})
export class DetalleArchivoComponent implements OnInit {

  constructor(
    private papa: Papa,
    private S3Service: S3Service
    ) { }

  ngOnInit(): void {

/*
    Bucket: 'sia-frontend-poc-csv',
    Key: 'sia-gen-adm-diccionario-catalogos-dev.csv',
*/

    const archivo = JSON.parse(localStorage.getItem('archivo'))

    const csvData =  this.S3Service.generarConexionS3(archivo.Bucket,archivo.Key)

    this.papa.parse(csvData, {
      download: true,
      header: true,
      complete: (result) => {
        const container = document.querySelector('#example1');
        const data = result.data;
        const hot = new Handsontable(container, {
          data,
          class:'hot',
          contextMenu: true,
          height: 'auto',
          language: 'es-MX',
          licenseKey: 'non-commercial-and-evaluation',
          colHeaders: true,
          readOnly: true,
          dropdownMenu: [
            'filter_by_condition',
            'filter_operators',
            'filter_by_condition2',
            'filter_by_value',
            'filter_action_bar'
          ],
          filters: true,
          rowHeaders: true,
        });
      },
    });
  }

}
