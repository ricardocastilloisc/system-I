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


///aqui lo que hacemos es mostrar la informacion del bucket que quermos  con el archivo osea la url
    const archivo = JSON.parse(localStorage.getItem('archivo'))

    //buscamos el bucket que necesitamos
    const csvData =  this.S3Service.generarConexionS3(archivo.Bucket,archivo.Key)


    //transformamos el acthvio
    this.papa.parse(csvData, {
      download: true,
      header: true,
      //una vez completado hace la funcion de generar el  visualizador
      complete: (result) => {
        //lo meto en contenedor
        const container = document.querySelector('#example1');
        const data = result.data;
        //lo personalizo limitando las seccinoes que deseo como indica la libreria
        const hot = new Handsontable(container, {
          data,
          class:'hot',
          contextMenu: true,
          height: 'auto',
          language: 'es-MX',
          licenseKey: 'non-commercial-and-evaluation',
          colHeaders: true,
          readOnly: true,
          //solo el dejo los filtros
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
