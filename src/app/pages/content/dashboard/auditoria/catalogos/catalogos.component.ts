import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadAUDGENUSUARIOS, UnsetAUDGENUSUARIO } from './../../../../../ReduxStore/actions/usuarios/AUDGENUSUARIOS.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable } from 'rxjs';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/AUDGENUSUARIO.model';
import { APIService } from '../../../../../API.service';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit, OnDestroy {

  filtroAuditoriaCatalogosForm: FormGroup;

  maxDate: Date;

  itemsCorreos = [];
  itemsCatalogos = [];
  itemsAcciones = [];

  itemsAntes = [];
  itemsDespues = [];
  itemsValor = [];

  dropdownListFiltroCatalogo = [];
  SettingsFiltroDeCatalogo: IDropdownSettings = {};
  selectedItemsFiltroCatalogo = [];

  dropdownListFiltroAccion = [];
  SettingsFiltroDeAccion: IDropdownSettings = {};
  selectedItemsFiltroAccion = [];

  dropdownListFiltroCorreo = [];
  SettingsFiltroDeCorreo: IDropdownSettings = {};
  selectedItemsFiltroCorreo = [];

  constructor(
    private store: Store<AppState>,
    private api: APIService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  AUDGENUSUARIOS$: Observable<AUDGENUSUARIO_INTERFACE[]>;
  ListadoPantalla: AUDGENUSUARIO_INTERFACE[] = [];
  ListadoOriginal: AUDGENUSUARIO_INTERFACE[] = [];

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENUSUARIO());
  }

  enProceso(): boolean {
    return false;
  }

  initSelects = () => {
    this.filtroAuditoriaCatalogosForm = this.fb.group({
      filtroFecha: []
    })
    if (this.itemsCatalogos.length > 0) {
      let arregloCatalogos = [];
      for (let i in this.itemsCatalogos) {
        arregloCatalogos.push({ item_id: this.itemsCatalogos[i], item_text: this.itemsCatalogos[i] });
      }
      this.dropdownListFiltroCatalogo = arregloCatalogos;
    }
    if (this.itemsAcciones.length > 0) {
      let arregloAcciones = [];
      for (let i in this.itemsAcciones) {
        arregloAcciones.push({ item_id: this.itemsAcciones[i], item_text: this.itemsAcciones[i] });
      }

      this.dropdownListFiltroAccion = arregloAcciones;
    }

    if (this.itemsCorreos.length > 0) {
      let arregloCorreos = [];
      for (let i in this.itemsCorreos) {
        arregloCorreos.push({ item_id: this.itemsCorreos[i], item_text: this.itemsCorreos[i] });
      }

      this.dropdownListFiltroCorreo = arregloCorreos;
    }

    this.SettingsFiltroDeCatalogo = {
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

    this.SettingsFiltroDeCorreo = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
      itemsShowLimit: 3,
    };
  }

  limpirarFiltro = () => {
    console.log("limpirarFiltro");
    this.selectedItemsFiltroCatalogo = [];
    this.selectedItemsFiltroAccion = [];
    this.selectedItemsFiltroCorreo = [];
    this.ListadoPantalla = this.ListadoOriginal;
  }

  filtrar = () => {
    this.spinner.show();
    let FiltrarCatalogo = null;
    let FiltrarAccion = null;
    let FiltrarCorreo = null;
    let FiltrarFecha = this.filtroAuditoriaCatalogosForm.get('filtroFecha').value; //yyyy-mm-dd

    if (this.selectedItemsFiltroCatalogo.length !== 0) {
      let arrayFiltroCatalogo = [];
      this.selectedItemsFiltroCatalogo.forEach((e) => {
        arrayFiltroCatalogo.push(e.item_id);
      });
      FiltrarCatalogo = arrayFiltroCatalogo;

    }
    if (this.selectedItemsFiltroAccion.length !== 0) {
      let arrayFiltroAccion = [];
      this.selectedItemsFiltroAccion.forEach((e) => {
        arrayFiltroAccion.push(e.item_id);
      });
      FiltrarAccion = arrayFiltroAccion;
    }
    if (this.selectedItemsFiltroCorreo.length !== 0) {
      let arrayFiltroCorreo = [];
      this.selectedItemsFiltroCorreo.forEach((e) => {
        arrayFiltroCorreo.push(e.item_id);
      });
      FiltrarCorreo = arrayFiltroCorreo;
    }
    this.ListadoPantalla = this.filtrarCatalogosConAtributos(
      this.ListadoOriginal,
      FiltrarCatalogo,
      FiltrarAccion,
      FiltrarCorreo,
      FiltrarFecha
    );
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  }

  cambiarEtiquetaSeleccionadaGeneral(elemento) {
    setTimeout(() => {
      $('#' + elemento)
        .find('.selected-item')
        .attr('class', 'etiquetasCatalogos');
    }, 1);
  }
  ngOnInit(): void {

    this.AUDGENUSUARIOS$ = this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
    }
    ))
    this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).subscribe(res => {

      for (let i in res) {

        if (!this.itemsCorreos.includes(res[i].CORREO)) {
          this.itemsCorreos.push(res[i].CORREO);
        }
      }

      for (let i in res) {

        if (!this.itemsCatalogos.includes(res[i].CATALOGOS.DESCRIPCION)) {
          this.itemsCatalogos.push(res[i].CATALOGOS.DESCRIPCION);
        }
      }

      for (let i in res) {

        if (!this.itemsAcciones.includes(res[i].CATALOGOS.ACCION)) {
          this.itemsAcciones.push(res[i].CATALOGOS.ACCION);
        }
      }

      this.itemsCatalogos.sort();
      this.itemsAcciones.sort();
      this.itemsCorreos.sort();
      if (res === null) {
        console.log("res", res)
      }
      else {
        let resp = res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
        console.log("resp", resp)
        this.ListadoOriginal = resp;
      }
      this.ListadoPantalla = this.ListadoOriginal;
      this.initSelects();
    })
    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'CATALOGOS' } }));
    /*
    this.api.ListAUDGENUSUARIOS('CATALOGOS').then(res => {
      //console.log("Response ListAUDGENUSUARIOS", res)
    })
    */
  }

  openModal(content, objetoDetalle: AUDGENUSUARIO_INTERFACE) {
    this.itemsValor = [];
    this.itemsAntes = [];
    this.itemsDespues = [];

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

    }
    if (cambiosAntes !== null) {
      let getValor = cambiosAntes.split(",");
      let resultado = [];
      for (let i in getValor) {
        let valor = getValor[i].toString().split("=");
        resultado.push(valor[0]);
      }
      this.itemsValor = resultado;

    }
    else if (cambiosDespues !== null) {
      let getValor = cambiosDespues.split(",");
      let resultado = [];
      for (let i in getValor) {
        let valor = getValor[i].toString().split("=");
        resultado.push(valor[0]);
      }
      this.itemsValor = resultado;

    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }



  filtrarCatalogosConAtributos(ListadoOriginal: AUDGENUSUARIO_INTERFACE[], FiltrarCatalogo, FiltrarAccion, FiltrarCorreo, FiltrarFecha): any {
    let response = ListadoOriginal;
    if (FiltrarCatalogo != null) {
      let arrayTempPermiso = [];
      FiltrarCatalogo.forEach((FiltrarCatalogo) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.CATALOGOS.DESCRIPCION === FiltrarCatalogo),
        ];
      });
      response = arrayTempPermiso;
    }

    if (FiltrarAccion != null) {
      let arrayTempPermiso = [];
      FiltrarAccion.forEach((FiltrarAccion) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.CATALOGOS.ACCION === FiltrarAccion),
        ];
      });
      response = arrayTempPermiso;
    }

    if (FiltrarCorreo != null) {
      let arrayTempPermiso = [];
      FiltrarCorreo.forEach((FiltrarCorreo) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.CORREO === FiltrarCorreo),
        ];
      });
      response = arrayTempPermiso;
    }

    if (FiltrarFecha != null) {
      let arrayTempFecha = [];
      console.log("FiltrarFecha", FiltrarFecha)
      arrayTempFecha = response.filter((e) => e.FECHA.includes(FiltrarFecha))
      console.log("arrayTempFecha", arrayTempFecha)
      response = arrayTempFecha;
    }

    const uniqueArr = [... new Set(response.map(data => data.ID))]
    console.log(uniqueArr)
    return response;
  }

}
