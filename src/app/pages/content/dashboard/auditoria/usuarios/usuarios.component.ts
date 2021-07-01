import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadAUDGENUSUARIOS, UnsetAUDGENUSUARIO } from './../../../../../ReduxStore/actions/usuarios/AUDGENUSUARIOS.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Subscription } from 'rxjs';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/AUDGENUSUARIO.model';
import { APIService } from '../../../../../API.service';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValorFiltrarAcciones } from 'src/app/validators/opcionesDeFiltroAccionesAuditoriaUsuariios';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {

  filtroAuditoriaUsuariosForm: FormGroup;
  maxDate: Date;

  itemsAntes = [];
  itemsDespues = [];
  itemsValor = [];
  itemsTabla = [];
  detalleCambios: any;

  listadoUsuarios: AUDGENUSUARIO_INTERFACE[];
  listadoOriginalUsuarios: AUDGENUSUARIO_INTERFACE[];

  ListadoUsuariosPantalla: AUDGENUSUARIO_INTERFACE[] = [];

  dropdownListFiltroPermisos = [];
  SettingsFiltroDePermisos: IDropdownSettings = {};
  selectedItemsFiltroaPermisos = [];

  dropdownListFiltroCorreos = [];
  SettingsFiltroDeCorreos: IDropdownSettings = {};
  selectedItemsFiltroCorreos = [];

  dropdownListFiltroNombres = [];
  SettingsFiltroDeNombres: IDropdownSettings = {};
  selectedItemsFiltroNombres = [];

  dropdownListFiltroAccion = [];
  SettingsFiltroDeAccion: IDropdownSettings = {};
  selectedItemsFiltroAccion = [];

  verModal = false;

  constructor(
    private store: Store<AppState>,
    private api: APIService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  AUDGENUSUARIOS$: Subscription;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENUSUARIO());
    this.AUDGENUSUARIOS$.unsubscribe();
  }

  enProceso(): boolean {
    return false;
  }
  initSelects = () => {

    this.maxDate = new Date();

    this.filtroAuditoriaUsuariosForm = this.fb.group({
      filtroFecha: []
    })

    this.dropdownListFiltroAccion = [
      { item_id: ValorFiltrarAcciones.Actualizar, item_text: ValorFiltrarAcciones.Actualizar },
      { item_id: ValorFiltrarAcciones.Eliminar, item_text: ValorFiltrarAcciones.Eliminar }
    ]

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

    this.SettingsFiltroDeCorreos = {
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

    this.SettingsFiltroDeNombres = {
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

  limpiarFiltro = () => {
    this.selectedItemsFiltroNombres = [];
    this.selectedItemsFiltroAccion = [];
    this.selectedItemsFiltroCorreos = [];
    this.ListadoUsuariosPantalla = this.listadoOriginalUsuarios;
    this.filtroAuditoriaUsuariosForm.reset();
  }

  filtrar = () => {
    this.spinner.show();

    let FiltrarNombre = null;
    let FiltrarAccion = null;
    let FiltrarCorreo = null;
    let FiltrarFecha = this.filtroAuditoriaUsuariosForm.get('filtroFecha').value;

    if (this.selectedItemsFiltroNombres.length !== 0) {
      let arrayFiltroNombres = [];
      this.selectedItemsFiltroNombres.forEach((e) => {
        arrayFiltroNombres.push(e.item_id);
      });
      FiltrarNombre = arrayFiltroNombres;
    }

    if (this.selectedItemsFiltroAccion.length !== 0) {
      let arrayFiltroAccion = [];
      this.selectedItemsFiltroAccion.forEach((e) => {
        arrayFiltroAccion.push(e.item_id);
      });
      FiltrarAccion = arrayFiltroAccion;
    }
    if (this.selectedItemsFiltroCorreos.length !== 0) {
      let arrayFiltroCorreo = [];
      this.selectedItemsFiltroCorreos.forEach((e) => {
        arrayFiltroCorreo.push(e.item_id);
      });
      FiltrarCorreo = arrayFiltroCorreo;
    }
    this.ListadoUsuariosPantalla = this.FiltrarNombresConAtributos(
      this.listadoOriginalUsuarios,
      FiltrarNombre,
      FiltrarAccion,
      FiltrarCorreo,
      FiltrarFecha
    )

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
    )).subscribe(usuarios => {
      this.listadoUsuarios = usuarios;

      let arrayCorreos = [];
      let arrayNombres = [];
      if (this.listadoUsuarios) {
        this.listadoUsuarios.forEach((e) => {
          if (
            this.dropdownListFiltroCorreos.filter(
              (f) => f.item_id == e.CORREO
            ).length === 0
          ) {
            let index = arrayCorreos.findIndex(x => x.item_id == e.CORREO);

            index === -1 ? arrayCorreos.push({
              item_id: e.CORREO,
              item_text: e.CORREO,
            }) : null

            index === -1 ? arrayNombres.push({
              item_id: e.USUARIO.NOMBRE + e.USUARIO.APELLIDO_PATERNO,
              item_text: e.USUARIO.NOMBRE + ' ' + e.USUARIO.APELLIDO_PATERNO
            }) : null
          }
        });
        if (this.dropdownListFiltroCorreos.length === 0) {
          this.dropdownListFiltroCorreos = [...new Set(arrayCorreos)];
          this.dropdownListFiltroNombres = [...new Set(arrayNombres)];
        }

      }

      this.ListadoUsuariosPantalla = usuarios;
      this.listadoOriginalUsuarios = usuarios;

    })
    this.store.dispatch(LoadAUDGENUSUARIOS({ consult: { MODULO: 'USUARIOS' } }));
  }

  cambiarEtiquetaSeleccionadaGeneral(elemento) {
    setTimeout(() => {
      $('#' + elemento)
        .find('.selected-item')
        .attr('class', 'etiquetasCatalogos');
    }, 1);
  }

  mostrarDetalle(): boolean {
    return this.verModal;
  }

  ocultarModal(): void {
    this.verModal = false;
  }

  openModal(objetoDetalle: AUDGENUSUARIO_INTERFACE): void {
    this.itemsTabla = [];
    const accion = objetoDetalle.PERMISOS_USUARIOS[0].ACCION;
    let valores = [];
    let tabla = [];
    let arregloAntes = [];
    let arregloDespues = [];
    let cambiosAntes = objetoDetalle.PERMISOS_USUARIOS[0].DETALLE_MODIFICACIONES[0].valorAnterior;
    let cambiosDespues = objetoDetalle.PERMISOS_USUARIOS[0].DETALLE_MODIFICACIONES[0].valorNuevo;
    let valorAntes;
    let valorDespues;
    let banderaCambio = false;
    this.detalleCambios = {
      nombre: objetoDetalle.PERMISOS_USUARIOS[0].NOMBRE + ' ' + objetoDetalle.PERMISOS_USUARIOS[0].APELLIDO_PATERNO,
      usuario: objetoDetalle.USUARIO.NOMBRE + ' ' + objetoDetalle.USUARIO.APELLIDO_PATERNO,
      fecha: objetoDetalle.FECHA
    };
    this.itemsValor = [];
    this.itemsAntes = [];
    this.itemsDespues = [];

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

    if (cambiosAntes !== null) {
      cambiosAntes = cambiosAntes.replace('{', '');
      cambiosAntes = cambiosAntes.replace('}', '');
    }

    if (cambiosDespues !== null) {
      cambiosDespues = cambiosDespues.replace('{', '');
      cambiosDespues = cambiosDespues.replace('}', '');
    }

    if (accion === 'ELIMINAR') {
      const getValor = cambiosAntes.split(', ');
      for (let i in getValor) {
        if (getValor) {
          let valor = getValor[i].toString().split('=');
          valores.push(valor[0]);
        }
      }
      arregloAntes = cambiosAntes.split(', ');

    } else {
      const getValor = cambiosDespues.split(', ');
      for (let i in getValor) {
        if (getValor) {
          let valor = getValor[i].toString().split('=');
          valores.push(valor[0]);
        }
      }
      if (cambiosAntes !== null) {
        arregloAntes = cambiosAntes.split(', ');
        arregloDespues = cambiosDespues.split(', ');
      }
    }

    if (valores !== null) {
      for (let i in valores) {
        if (valores) {
          if (arregloAntes.length > 0) {
            valorAntes = arregloAntes.find(e => e.includes(valores[i])) ? arregloAntes.find(e => e.includes(valores[i])).split('=')[1] : '';
          } else {
            valorAntes = '';
          }
          if (arregloDespues.length > 0) {

            valorDespues = arregloDespues.find(e => e.includes(valores[i])) ? arregloDespues.find(e => e.includes(valores[i])).split('=')[1] : '';
          } else {
            valorDespues = '';
          }
          if (valorAntes === valorDespues) { banderaCambio = false; }
          else { banderaCambio = true; }
          if (valores[i] === 'area') {
            valores[i] = 'área';
          }
          tabla.push({ valor: valores[i], antes: valorAntes, despues: valorDespues, cambio: banderaCambio })
        }
      }
    }
    this.itemsTabla = tabla;

    this.verModal = true;
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

  FiltrarNombresConAtributos(ListadoOriginal: AUDGENUSUARIO_INTERFACE[], FiltrarNombre, FiltrarAccion, FiltrarCorreo, FiltrarFecha): any {
    let response = ListadoOriginal;
    if (FiltrarNombre != null) {
      let arrayTempPermiso = [];
      FiltrarNombre.forEach((FiltrarNombre) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.USUARIO.NOMBRE + e.USUARIO.APELLIDO_PATERNO === FiltrarNombre),
        ];
      });
      response = arrayTempPermiso;
    }

    if (FiltrarAccion != null) {
      let arrayTempPermiso = [];
      FiltrarAccion.forEach((FiltrarAccion) => {
        arrayTempPermiso = [
          ...arrayTempPermiso,
          ...response.filter((e) => e.PERMISOS_USUARIOS[0].ACCION === FiltrarAccion.toUpperCase()),
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
    return response;
  }

}
