import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css'],
})
export class ArchivosComponent implements OnInit {

  /*popciones o varioables de bandera para filtros configuraciones etc. */
  maxDate: Date = new Date();
  filtroFecha = new FormControl(new Date(), []);
  SettingsProceso: IDropdownSettings = {};
  dropdownListProceso = [];
  selectedItemsProceso = [];

  /*aqui contendra el listado de archivos con sus caracteristicas*/
  archivos = [
    {
      Bucket: '**bucket**',
      Key: '**key**',
      fecha: '**fecha**',
      descripcion: '**descripcion**',
    },
  ];

  constructor(private router: Router,) {}

  irArchivo = (archivo) => {
    //mando la informacion que necesito a la otra pantalla
    localStorage.setItem('archivo',JSON.stringify(archivo))
    this.router.navigate(['/' + window.location.pathname + '/' + archivo.Key]);
  }

  ngOnInit(): void {
    this.filtroFecha.setValue(moment().format('YYYY-MM-DD').toString());
    //para los filtros
    this.SettingsProceso = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      clearSearchFilter: true,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Buscar Proceso',
    };
  }
}
