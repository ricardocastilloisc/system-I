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
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
declare var $: any;

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.css']
})
export class ProcesosComponent implements OnInit, OnDestroy {

  filtroAuditoriaCatalogosForm: FormGroup;

  maxDate: Date;

  itemsCorreos = [];
  itemsCatalogos = [];
  itemsAcciones = [];

  itemsTabla = [];
  detalleCambios: any;

  dropdownListFiltroCatalogo = [];
  SettingsFiltroDeCatalogo: IDropdownSettings = {};
  selectedItemsFiltroCatalogo = [];

  dropdownListFiltroAccion = [];
  SettingsFiltroDeAccion: IDropdownSettings = {};
  selectedItemsFiltroAccion = [];

  dropdownListFiltroCorreo = [];
  SettingsFiltroDeCorreo: IDropdownSettings = {};
  selectedItemsFiltroCorreo = [];

  paginaActual: number = 1;
  verModal = false;

  constructor(
    private store: Store<AppState>,
    private api: APIService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
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

  mostrarDetalle(): boolean {
    return this.verModal;
  }

  initSelects = () => {

    this.maxDate = new Date();

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
    this.selectedItemsFiltroCatalogo = [];
    this.selectedItemsFiltroAccion = [];
    this.selectedItemsFiltroCorreo = [];
    this.ListadoPantalla = this.ListadoOriginal;
    this.filtroAuditoriaCatalogosForm.reset();
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

    //console.log(this.selectedItemsFiltroAccion)
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

        if (!this.itemsCatalogos.includes(res[i].PROCESOS.NOMBRE)) {
          this.itemsCatalogos.push(res[i].PROCESOS.NOMBRE);
        }
      }

      for (let i in res) {

        if (!this.itemsAcciones.includes(res[i].PROCESOS.ACCION)) {
          this.itemsAcciones.push(res[i].PROCESOS.ACCION);
        }
      }

      this.itemsCatalogos.sort();
      this.itemsAcciones.sort();
      this.itemsCorreos.sort();
      if (res === null) {
        //console.log("response", res)
      }
      else {
        let resp = res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
        //console.log("response slice", resp)
        this.ListadoOriginal = resp;
      }
      this.ListadoPantalla = this.ListadoOriginal;
      this.initSelects();
    })
    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'PROCESOS' } }));
    /*
    this.api.ListAUDGENUSUARIOS('PROCESOS').then(res => {
      console.log("Response ListAUDGENUSUARIOS", res)
    })*/

  }

  ocultarModal(): void {
    this.verModal = false;
  }

  openModal(objetoDetalle: AUDGENUSUARIO_INTERFACE): void {
    //console.log("objetoDetalle", objetoDetalle)
    this.detalleCambios = {
      idProceso: objetoDetalle.PROCESOS.ID_PROCESO,
      sigla: objetoDetalle.PROCESOS.SIGLA,
      proceso: objetoDetalle.PROCESOS.NOMBRE,
      usuario: objetoDetalle.USUARIO.NOMBRE + ' ' + objetoDetalle.USUARIO.APELLIDO_PATERNO,
      fecha: objetoDetalle.FECHA,
      accion: objetoDetalle.PROCESOS.ACCION,
      estado: objetoDetalle.PROCESOS.ESTADO,
      descripcion: objetoDetalle.PROCESOS.DESCRIPCION,
    };
    //console.log("detalleCambios", this.detalleCambios)
    this.verModal = true;

  }

  filtrarCatalogosConAtributos(ListadoOriginal: AUDGENUSUARIO_INTERFACE[], FiltrarCatalogo, FiltrarAccion, FiltrarCorreo, FiltrarFecha): any {
    let response = ListadoOriginal;
    if (FiltrarCatalogo != null) {
      let arrayTempPermiso = [];
      FiltrarCatalogo.forEach((FiltrarCatalogo) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.PROCESOS.NOMBRE === FiltrarCatalogo),
        ];
      });
      response = arrayTempPermiso;
    }

    if (FiltrarAccion != null) {
      let arrayTempPermiso = [];
      FiltrarAccion.forEach((FiltrarAccion) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.PROCESOS.ACCION === FiltrarAccion),
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
      arrayTempFecha = response.filter((e) => e.FECHA.includes(FiltrarFecha))
      response = arrayTempFecha;
    }

    return response;
  }

  redireccionProceso = (detalleCambios: any) => {
    const url = 'procesos/diurno/' + detalleCambios.sigla;
    localStorage.setItem('audProcesos', JSON.stringify(detalleCambios));
    this.router.navigateByUrl(url).then(() => {
      //console.log("navigateByUrl", detalleCambios.proceso)
    })

  }

  valiarIdProceso(detalleCambios: any): boolean {
    //console.log('idProceso', detalleCambios.idProceso)
    let flag = false;
    if (detalleCambios.idProceso) {
      if (detalleCambios.idProceso.length > 0) {
        flag = true;
      }
    }
    return flag;
  }

}