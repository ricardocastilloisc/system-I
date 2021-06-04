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
declare var $: any;

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit, OnDestroy {

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
    private spinner: NgxSpinnerService
  ) { }

  AUDGENUSUARIOS$: Observable<AUDGENUSUARIO_INTERFACE[]>;
  ListadoPantalla$: Observable<AUDGENUSUARIO_INTERFACE[]>;
  ListadoOriginal$: Observable<AUDGENUSUARIO_INTERFACE[]>;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENUSUARIO());
  }

  enProceso(): boolean {
    return false;
  }

  initSelects = () => {
    //console.log(this.itemsCatalogos.length)
    if (this.itemsCatalogos.length > 0) {
      let arregloCatalogos = [];
      for (let i in this.itemsCatalogos) {
        arregloCatalogos.push({ item_id: this.itemsCatalogos[i], item_text: this.itemsCatalogos[i] });
      }
      //console.log("arregloCatalogos", arregloCatalogos)
      this.dropdownListFiltroCatalogo = arregloCatalogos;
    }
    //console.log(this.itemsAcciones.length)
    if (this.itemsAcciones.length > 0) {
      let arregloAcciones = [];
      for (let i in this.itemsAcciones) {
        arregloAcciones.push({ item_id: this.itemsAcciones[i], item_text: this.itemsAcciones[i] });
      }
      //console.log("arregloAcciones", arregloAcciones)
      this.dropdownListFiltroAccion = arregloAcciones;
    }
    //console.log(this.itemsCorreos.length)
    if (this.itemsCorreos.length > 0) {
      let arregloCorreos = [];
      for (let i in this.itemsCorreos) {
        arregloCorreos.push({ item_id: this.itemsCorreos[i], item_text: this.itemsCorreos[i] });
      }
      //console.log("arregloCorreos", arregloCorreos)
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
    this.ListadoPantalla$ = this.ListadoOriginal$;
  }

  filtrar = () => {
    this.spinner.show();
    let FiltrarCatalogo = null;
    let FiltrarAccion = null;
    let FiltrarCorreo = null;
    if (this.selectedItemsFiltroCatalogo.length !== 0) {
      let arrayFiltroCatalogo = [];
      this.selectedItemsFiltroCatalogo.forEach((e) => {
        arrayFiltroCatalogo.push(e.item_id);
      });
      FiltrarCatalogo = arrayFiltroCatalogo;
      //console.log("FiltrarCatalogo", FiltrarCatalogo);
    }
    if (this.selectedItemsFiltroAccion.length !== 0) {
      let arrayFiltroAccion = [];
      this.selectedItemsFiltroAccion.forEach((e) => {
        arrayFiltroAccion.push(e.item_id);
      });
      FiltrarAccion = arrayFiltroAccion;
      //console.log("FiltrarAccion", FiltrarAccion);
    }
    if (this.selectedItemsFiltroCorreo.length !== 0) {
      let arrayFiltroCorreo = [];
      this.selectedItemsFiltroCorreo.forEach((e) => {
        arrayFiltroCorreo.push(e.item_id);
      });
      FiltrarCorreo = arrayFiltroCorreo;
      //console.log("FiltrarCorreo", FiltrarCorreo);
    }
    this.ListadoPantalla$ = this.filtrarCatalogosConAtributos(
      this.ListadoOriginal$,
      FiltrarCatalogo,
      FiltrarAccion,
      FiltrarCorreo
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
    //console.log("Entrando a OnInit: Auditoria Catalogos");    
    this.AUDGENUSUARIOS$ = this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).pipe(map(res => {
      if (res === null) return res
      else return res.slice().sort(function (a, b) { return new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime() })
    }
    ))

    this.ListadoOriginal$ = this.AUDGENUSUARIOS$;
    console.log("this.AUDGENUSUARIOS$", this.AUDGENUSUARIOS$)
    
    this.store.select(
      ({ AUDGENUSUARIOS }) => AUDGENUSUARIOS.AUDGENUSUARIOS
    ).subscribe(res => {
      //console.log("Store Select AUDGENUSUARIOS", res)      
      for (let i in res) {
        //console.log("for", res[i].CORREO);
        if (!this.itemsCorreos.includes(res[i].CORREO)) {
          this.itemsCorreos.push(res[i].CORREO);
        }
      }
      //console.log("correos", this.itemsCorreos)
      for (let i in res) {
        //console.log("for", res[i].CATALOGOS.DESCRIPCION);
        if (!this.itemsCatalogos.includes(res[i].CATALOGOS.DESCRIPCION)) {
          this.itemsCatalogos.push(res[i].CATALOGOS.DESCRIPCION);
        }
      }
      //console.log("catalogos", this.itemsCatalogos.length);
      for (let i in res) {
        //console.log("for", res[i].CATALOGOS.ACCION);
        if (!this.itemsAcciones.includes(res[i].CATALOGOS.ACCION)) {
          this.itemsAcciones.push(res[i].CATALOGOS.ACCION);
        }
      }
      //console.log("acciones", this.itemsAcciones.length);
      this.itemsCatalogos.sort();
      this.itemsAcciones.sort();
      this.itemsCorreos.sort();
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

  filtrarCatalogosConAtributos(ListadoOriginal, FiltrarCatalogo, FiltrarAccion, FiltrarCorreo):any{

  }

  filtrarUsuariosConAtributos = (
    usuarios,
    permiso,
    areas,
    Correo
  ) => {
    let Usuarios = [...usuarios];

    if (Correo != null) {
      let arrayTempCorreo = [];
      Correo.forEach((Correo) => {
        arrayTempCorreo = [
          ...arrayTempCorreo,
          ...Usuarios.filter((e) => e.Attributes['email'] === Correo),
        ];
      });
      Usuarios = arrayTempCorreo;
    }

    if (permiso != null) {
      let arrayTempPermiso = [];
      permiso.forEach((permiso) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...Usuarios.filter((e) => e.Attributes['custom:rol'] === permiso),
        ];
      });
      Usuarios = arrayTempPermiso;
    }
    if (areas != null) {
      let arrayTempArea = [];

      areas.forEach((area) => {
        Usuarios.forEach((usuario) => {
          let areaArrayAtributoTemp =
            usuario.GrupoQuePertenece.trim().length === 0
              ? []
              : usuario.GrupoQuePertenece.split(',');

          if (areaArrayAtributoTemp.includes(area)) {
            arrayTempArea = [...arrayTempArea, usuario];
          }
        });
      });

      Usuarios = arrayTempArea;
    }

    return Usuarios;
  };
}
