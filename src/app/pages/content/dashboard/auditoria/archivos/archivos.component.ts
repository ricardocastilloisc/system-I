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
  maxDate: Date = new Date();
  filtroFecha = new FormControl(new Date(), []);
  SettingsProceso: IDropdownSettings = {};
  dropdownListProceso = [];
  selectedItemsProceso = [];

  archivos = [
    {
      Bucket: 'sia-frontend-poc-csv',
      Key: 'sia-gen-adm-diccionario-catalogos-dev.csv',
      fecha: '2021-07-28',
      descripcion: 'descripcion',
    },
  ];

  constructor(private router: Router,) {}

  irArchivo = (archivo) => {
    localStorage.setItem('archivo',JSON.stringify(archivo))
    this.router.navigate(['/' + window.location.pathname + '/' + archivo.Key]);
  }

  ngOnInit(): void {
    this.filtroFecha.setValue(moment().format('YYYY-MM-DD').toString());

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
