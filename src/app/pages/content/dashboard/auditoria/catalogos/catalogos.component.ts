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

    console.log(this.selectedItemsFiltroAccion)
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
    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'CATALOGOS' } }));
    /*
    this.api.ListAUDGENUSUARIOS('CATALOGOS').then(res => {
      //console.log("Response ListAUDGENUSUARIOS", res)
    })
    */
  }

  ocultarModal(): void {
    this.verModal = false;
  }

  openModal(objetoDetalle: AUDGENUSUARIO_INTERFACE): void {

    this.itemsTabla = [];
    let accion = objetoDetalle.CATALOGOS.ACCION;
    let valores = [];
    let tabla = [];
    let arregloAntes = [];
    let arregloDespues = [];
    let cambiosAntes = objetoDetalle.CATALOGOS.DETALLE_MODIFICACIONES[0].valorAnterior;
    let cambiosDespues = objetoDetalle.CATALOGOS.DETALLE_MODIFICACIONES[0].valorNuevo;
    let valorAntes;
    let valorDespues;
    let banderaCambio = false;
    this.detalleCambios = {
      catalogo: objetoDetalle.CATALOGOS.DESCRIPCION,
      usuario: objetoDetalle.USUARIO.NOMBRE + ' ' + objetoDetalle.USUARIO.APELLIDO_PATERNO,
      fecha: objetoDetalle.FECHA
    };

    if (cambiosAntes !== null) {
      cambiosAntes = cambiosAntes.replace('{', '');
      cambiosAntes = cambiosAntes.replace('}', '');
    }

    if (cambiosDespues !== null) {
      cambiosDespues = cambiosDespues.replace('{', '');
      cambiosDespues = cambiosDespues.replace('}', '');
    }

    if (accion === 'ELIMINAR') {
      let getValor = cambiosAntes.split(',');
      for (let i in getValor) {
        if (getValor) {
          let valor = getValor[i].toString().split('=');
          valores.push(valor[0]);
        }
      }
      arregloAntes = cambiosAntes.split(',');
    } else {
      let getValor = cambiosDespues.split(',');
      for (let i in getValor) {
        if (getValor) {
          let valor = getValor[i].toString().split('=');
          valores.push(valor[0]);
        }
      }
      if (cambiosAntes !== null) {
        arregloAntes = cambiosAntes.split(',');
        arregloDespues = cambiosDespues.split(',');
      } else {
        arregloDespues = cambiosDespues.split(',');
      }
    }

    if (valores !== null) {
      for (let i in valores) {
        if (valores) {
          if (arregloAntes.length > 0) {
            valorAntes = arregloAntes.find(e => e.includes(valores[i])).split('=')[1];
          } else {
            valorAntes = '';
          }
          if (arregloDespues.length > 0) {
            valorDespues = arregloDespues.find(e => e.includes(valores[i])).split('=')[1];
          } else {
            valorDespues = '';
          }
          if (valorAntes === valorDespues) { banderaCambio = false; }
          else { banderaCambio = true; }
          tabla.push({ valor: valores[i], antes: valorAntes, despues: valorDespues, cambio: banderaCambio })
        }
      }
    }
    this.itemsTabla = tabla;
    this.verModal = true;

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
      arrayTempFecha = response.filter((e) => e.FECHA.includes(FiltrarFecha))
      response = arrayTempFecha;
    }

    const uniqueArr = [... new Set(response.map(data => data.ID))]
    //console.log(uniqueArr)
    return response;
  }

}
