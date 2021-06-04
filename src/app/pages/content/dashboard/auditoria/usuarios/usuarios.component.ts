import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadAUDGENUSUARIOS, UnsetAUDGENUSUARIO  } from './../../../../../ReduxStore/actions/usuarios/AUDGENUSUARIOS.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, Subscription } from 'rxjs';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/AUDGENUSUARIO.model';
import { APIService } from '../../../../../API.service';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';

import { ValorFiltrarAcciones } from 'src/app/validators/opcionesDeFiltroAccionesAuditoriaUsuariios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {

  itemsAntes = [];
  itemsDespues = [];
  itemsValor = [];

  listadoUsuarios: AUDGENUSUARIO_INTERFACE[];

  ListadoUsuariosPantalla: AUDGENUSUARIO_INTERFACE[] = [];

  dropdownListFiltroPermisos = [];
  SettingsFiltroDePermisos: IDropdownSettings = {};
  selectedItemsFiltroaPermisos = [];
  
  dropdownListFiltroCorreos= [];
  SettingsFiltroDeCorreos: IDropdownSettings = {};
  selectedItemsFiltroCorreos= [];


  dropdownListFiltroNombres= [];
  SettingsFiltroDeNombres: IDropdownSettings = {};
  selectedItemsFiltroNombres= [];


  dropdownListFiltroAccion = [];
  SettingsFiltroDeAccion: IDropdownSettings = {};
  selectedItemsFiltroAccion = [];

  constructor(
    private store: Store<AppState>,
    private api: APIService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {}


  AUDGENUSUARIOS$: Subscription;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENUSUARIO());
    this.AUDGENUSUARIOS$.unsubscribe();
  }

  enProceso(): boolean {
    return false;
  }
  initSelects = () => {

    this.dropdownListFiltroAccion = [
      { item_id: ValorFiltrarAcciones.Actualizar, item_text: ValorFiltrarAcciones.Actualizar },
      { item_id: ValorFiltrarAcciones.Eliminar, item_text: ValorFiltrarAcciones.Eliminar }
    ]

    this.dropdownListFiltroPermisos = [
      { item_id: "op1", item_text: "Opción uno" },
      { item_id: "op2", item_text: "Opción dos" },
      { item_id: "op3", item_text: "Opción tres" }
    ];

    this.SettingsFiltroDePermisos = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };

    this.SettingsFiltroDeAccion = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };

    this.SettingsFiltroDeCorreos ={
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      clearSearchFilter: true,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Buscar Correo electrónico',
    };

    this.SettingsFiltroDeNombres ={
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: true,
      clearSearchFilter: true,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Buscar Correo electrónico',
    };


  }

  limpirarFiltro = () => {
    this.selectedItemsFiltroaPermisos = [];
  }

  filtrar = () => {
    this.spinner.show();

    
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  };

  ngOnInit(): void {

    this.initSelects();

    this.AUDGENUSUARIOS$ = this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })

    }
    )).subscribe( usuarios => {
      this.listadoUsuarios = usuarios;

      console.log(this.listadoUsuarios)
      let arrayCorreos = [];
      let arrayNombres = [];
      if(this.listadoUsuarios){
        this.listadoUsuarios.forEach((e) => {
          if(
            this.dropdownListFiltroCorreos.filter(
              (f) => f.item_id == e.CORREO
            ).length === 0
          ) {
            let index = arrayCorreos.findIndex(x => x.item_id == e.CORREO);

            index === -1 ? arrayCorreos.push({
              item_id: e.CORREO,
              item_text: e.CORREO,
            }) : console.log("Ya existe este objeto ")

            index === -1 ? arrayNombres.push({
              item_id: e.USUARIO.NOMBRE + e.USUARIO.APELLIDO_PATERNO,
              item_text: e.USUARIO.NOMBRE + ' ' + e.USUARIO.APELLIDO_PATERNO
            }): console.log("Ya existe este objeto ")
          }
        });
        if (this.dropdownListFiltroCorreos.length === 0) {
          this.dropdownListFiltroCorreos = [...new Set(arrayCorreos)];
          this.dropdownListFiltroNombres = [...new Set(arrayNombres)];
        }

        console.log(this.dropdownListFiltroCorreos)

      }

      this.ListadoUsuariosPantalla = usuarios;
    })

    this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).subscribe(res => { console.log(res)})

    let body = {
      MODULO: { eq: 'USUARIOS' } 
    }
    
    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'USUARIOS'}}));

    this.api.ListAUDGENUSUARIOS('USUARIOS').then(res => {
      console.log(res)
    })
  }


  openModal(content, objetoDetalle: AUDGENUSUARIO_INTERFACE) {
    this.itemsValor = [];
    this.itemsAntes = [];
    this.itemsDespues = [];

    //console.log("Entrando al modal", objetoDetalle)

    let cambiosAntes = objetoDetalle.CATALOGOS.DETALLE_MODIFICACIONES[0].valorAnterior;
    if (cambiosAntes !== null) {
      cambiosAntes = cambiosAntes.replace('{', '');
      cambiosAntes = cambiosAntes.replace('}', '');
      let arregloAntes = cambiosAntes.split(",");
      let resAntes = [];
      for (let i in arregloAntes) {
        let valor = arregloAntes[i].toString().split("=");
        resAntes.push(valor[1]);
      }
      this.itemsAntes = resAntes;
      //console.log("cambiosAntes", arregloAntes)
    }

    let cambiosDespues = objetoDetalle.CATALOGOS.DETALLE_MODIFICACIONES[0].valorNuevo;
    if (cambiosDespues !== null) {
      cambiosDespues = cambiosDespues.replace('{', '');
      cambiosDespues = cambiosDespues.replace('}', '');
      let arregloDespues = cambiosDespues.split(",");
      let resDespues = [];
      for (let i in arregloDespues) {
        let valor = arregloDespues[i].toString().split("=");
        resDespues.push(valor[1]);
      }
      this.itemsDespues = resDespues;
      //console.log("cambiosDespues", arregloDespues)
    }

    if (cambiosAntes !== null) {
      let getValor = cambiosAntes.split(",");
      let resultado = [];
      for (let i in getValor) {
        let valor = getValor[i].toString().split("=");
        resultado.push(valor[0]);
      }
      this.itemsValor = resultado;
      //console.log("result", resultado)
    }
    else if (cambiosDespues !== null) {
      let getValor = cambiosDespues.split(",");
      let resultado = [];
      for (let i in getValor) {
        let valor = getValor[i].toString().split("=");
        resultado.push(valor[0]);
      }
      this.itemsValor = resultado;
      //console.log("result", resultado)
    }


    // console.log("itemsValor", this.itemsValor)
    // console.log("itemsAntes", this.itemsAntes)
    // console.log("itemsDespues", this.itemsDespues)

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }


  

  verPaginado = () => {
    if (this.ListadoUsuariosPantalla) {
      if (this.ListadoUsuariosPantalla.length > 10) {
        return true;
      } else {
        false;
      }
    } else {
      return false;
    }
  };

  
}
