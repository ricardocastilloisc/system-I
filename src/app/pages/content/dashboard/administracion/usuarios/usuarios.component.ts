import { ProcesoLimpiar } from './../../../../../ReduxStore/actions/loaderProcesoCambios.actions';
import { EArea } from './../../../../../validators/roles';
import {
  LoadListaUsuarios,
  UnsetListaUsuarios,
} from './../../../../../ReduxStore/actions/listaUsuarios.actions';
import { AppState } from './../../../../../ReduxStore/app.reducers';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UsuarioListado } from 'src/app/model/usuarioLitsa.model';
import { retornarStringSiexiste } from '../../../../../helpers/FuncionesUtiles';

import { ERole, ENegocio } from 'src/app/validators/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../../../../services/usuarios.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  Roles = [
    {
      label: 'Administrador',
      value: ERole.Administrador,
    },
    {
      label: 'Ejecutor',
      value: ERole.Ejecutor,
    },
    {
      label: 'Soporte',
      value: ERole.Soporte,
    },
  ];

  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.InversionesRiesgos,
    EArea.Tesoreria,
  ];

  Permisos = [ERole.Administrador, ERole.Ejecutor, ERole.Soporte];

  Negocios = [ENegocio.Afore, ENegocio.Fondos, ENegocio.Seguros];

  ObjectUsuarioCambiar: UsuarioListado;

  EstadoProceso: Subscription;
  ListadoUsuarios$: Subscription;
  Loading$: Subscription;

  ListadoUsuariosOriginal: UsuarioListado[] = [];
  ListadoUsuariosPantalla: UsuarioListado[] = [];

  insertarValores = false;

  grupoPertenece = '';

  dropdownListCambioDeNegocio = [];

  dropdownListFiltroCorreos = [];

  dropdownListFiltroPermisos = [];

  dropdownListFiltroAreas = [];

  SettingsCambioDeNegocio: IDropdownSettings = {};

  SettingsFiltroDeCorreos: IDropdownSettings = {};

  SettingsFiltroDePermisos: IDropdownSettings = {};

  SettingsFiltroDeArea: IDropdownSettings = {};

  ///aqui va ir los inputs que se iniciaran para el modal

  selectedItemsFiltroAreas = [];

  selectedItemsFiltroCorreos = [];

  selectedItemsFiltroaPermisos = [];

  selectedItemsCambioDeNegocio = [];
  SelectCamabiarPermiso = 'Permiso';
  SelectCamabiarArea = 'Area';

  paginaActualUsuarios: number = 1;

  loading = true;

  filtroActivo = false;

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal,
    private UsuariosService: UsuariosService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetListaUsuarios());
    this.ListadoUsuarios$.unsubscribe();
    this.EstadoProceso.unsubscribe();
    this.Loading$.unsubscribe();
  }

  cambiarEtiquetaSeleccionada() {
    setTimeout(() => {
      $('#correo')
        .find('.selected-item')
        .attr('class', 'etiquetaSelecetCustom');
    }, 1);
  }

  cambiarEtiquetaSeleccionadaGeneral(elemento) {
    setTimeout(() => {
      $('#'+elemento)
        .find('.selected-item')
        .attr('class', 'etiquetasUsuarios');
    }, 1);
  }



  ngOnInit(): void {
    this.initicializarLosSelects();

    this.Loading$ = this.store
      .select(({ ListaUsuarios }) => ListaUsuarios.loading)
      .subscribe((res) => {
        this.loading = res;

        if (res) {
          this.spinner.show();
        } else {
          this.spinner.hide();
        }
      });

    this.ListadoUsuarios$ = this.store
      .select(({ ListaUsuarios }) => ListaUsuarios.ListaUsuarios)
      .subscribe((ListadoDeUsuarios) => {
        this.ListadoUsuariosOriginal = ListadoDeUsuarios;

        let arrayCorreos = [];
        if (this.ListadoUsuariosOriginal) {
          this.ListadoUsuariosOriginal.forEach((e) => {
            if (
              this.dropdownListFiltroCorreos.filter(
                (f) => f.item_id === e.Attributes.email
              ).length === 0
            ) {
              arrayCorreos.push({
                item_id: e.Attributes.email,
                item_text: e.Attributes.email,
              });
            }
          });
          if(this.dropdownListFiltroCorreos.length === 0){
            this.dropdownListFiltroCorreos = arrayCorreos;
          }

        }

        this.ListadoUsuariosPantalla = ListadoDeUsuarios;

        if(this.filtroActivo){
          this.filtrar();
        }
      });

    this.store.dispatch(LoadListaUsuarios({ consulta: null }));

    this.EstadoProceso = this.store
      .select(({ ProcesoCambios }) => ProcesoCambios.terminado)
      .subscribe((estado) => {
        if (estado) {
          this.salirYRestablecer();
          this.store.dispatch(ProcesoLimpiar());
        }
      });
  }

  initicializarLosSelects = () => {
    this.dropdownListCambioDeNegocio = [
      { item_id: ENegocio.Afore, item_text: ENegocio.Afore },
      { item_id: ENegocio.Fondos, item_text: ENegocio.Fondos },
      {
        item_id: ENegocio.Seguros,
        item_text: ENegocio.Seguros,
      },
    ];
    this.dropdownListFiltroPermisos = [
      { item_id: ERole.Administrador, item_text: ERole.Administrador },
      { item_id: ERole.Ejecutor, item_text: ERole.Ejecutor },
      {
        item_id: ERole.Soporte,
        item_text: ERole.Soporte,
      },
    ];

    this.dropdownListFiltroAreas = [
      { item_id: EArea.Contabilidad, item_text: EArea.Contabilidad },
      { item_id: EArea.Custodia, item_text: EArea.Custodia },
      {
        item_id: EArea.Inversiones_Riesgos,
        item_text: EArea.Inversiones_Riesgos,
      },
      {
        item_id: EArea.Tesoreria,
        item_text: EArea.Tesoreria,
      },
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

    this.SettingsFiltroDeArea = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      clearSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
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
    /*
    singleSelection?: boolean;
    idField?: string;
    textField?: string;
    disabledField?: string;
    enableCheckAll?: boolean;
    selectAllText?: string;
    unSelectAllText?: string;
    allowSearchFilter?: boolean;
    clearSearchFilter?: boolean;
    maxHeight?: number;
    itemsShowLimit?: number;
    limitSelection?: number;
    searchPlaceholderText?: string;
    noDataAvailablePlaceholderText?: string;
    closeDropDownOnSelection?: boolean;
    showSelectedItemsAtTop?: boolean;
    defaultOpen?: boolean;
    allowRemoteDataSearch?: boolean;

*/
    this.SettingsCambioDeNegocio = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 150,
    };
  };

  openModalConfirmacionBaja(content, ObjectUsuario: UsuarioListado, grupoPertenece){
    this.ObjectUsuarioCambiar = ObjectUsuario;
    this.grupoPertenece = grupoPertenece;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  cerrarModal = (modal) =>{
    modal.close();
  }
  openModalConfirmacionEdicion = (modal) => {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' });
  }

  openModal(content, ObjectUsuario: UsuarioListado, grupoPertenece) {
    this.ObjectUsuarioCambiar = ObjectUsuario;
    this.grupoPertenece = grupoPertenece;


    this.cambiarEtiquetaSeleccionadaGeneral('cambiarnegocio');

    if (!retornarStringSiexiste(ObjectUsuario.Attributes, 'custom:rol')) {
      this.SelectCamabiarPermiso = 'Permiso';
    } else {
      if (ObjectUsuario.Attributes['custom:rol'] === '') {
        this.SelectCamabiarPermiso = 'Permiso';
      } else {
        this.SelectCamabiarPermiso = ObjectUsuario.Attributes['custom:rol'];
      }
    }

    if (!retornarStringSiexiste(ObjectUsuario.Attributes, 'custom:negocio')) {
      this.selectedItemsCambioDeNegocio = [];
    } else {
      if (ObjectUsuario.Attributes['custom:negocio'] === '') {
        this.selectedItemsCambioDeNegocio = [];
      } else {
        const newObject = Object.assign(
          {},
          { negocio: ObjectUsuario.Attributes['custom:negocio'] }
        );
        let { negocio } = newObject;
        let tempSelect = [];
        negocio.split(',').forEach((e) => {
          tempSelect.push({
            item_id: e,
            item_text: e,
          });
        });

        this.selectedItemsCambioDeNegocio = tempSelect;
      }
    }
    if (this.grupoPertenece === '') {
      this.SelectCamabiarArea = 'Area';
    } else {
      this.SelectCamabiarArea = this.grupoPertenece;
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  limpirarFiltro = () => {

    this.spinner.show();

    this.filtroActivo = false;
    this.ListadoUsuariosPantalla = this.ListadoUsuariosOriginal;

    this.selectedItemsFiltroAreas = [];

    this.selectedItemsFiltroCorreos = [];

    this.selectedItemsFiltroaPermisos = [];

    this.selectedItemsCambioDeNegocio = [];

    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  };

  guardarCambioPermisoUsuario = () => {
    if (
      this.SelectCamabiarPermiso === 'Permiso' &&
      this.selectedItemsCambioDeNegocio.length === 0 &&
      this.SelectCamabiarArea === 'Area'

    ) {
      return;
    }

    let arraySeleccionados = [];

    this.selectedItemsCambioDeNegocio.forEach((e) => {
      arraySeleccionados.push(e.item_id);
    });

    const UserAttributes = [
      {
        Name: 'custom:negocio',
        Value: arraySeleccionados.toString(),
      },
      {
        Name: 'custom:rol',
        Value: this.SelectCamabiarPermiso,
      },
    ];

    const Attributos = {
      UserAttributes: UserAttributes,
      Username: this.ObjectUsuarioCambiar.Username,
    };
    //console.log('AREA', this.SelectCamabiarArea);
    if(this.SelectCamabiarArea === 'Inversiones y Riesgos'){
      this.SelectCamabiarArea = 'InversionesyRiesgos';
    }
    //console.log('AREA CHANGE', this.SelectCamabiarArea);
    const Grupo = {
      Grupo: this.SelectCamabiarArea,
      Username: this.ObjectUsuarioCambiar.Username,
      GrupoOriginal: this.grupoPertenece,
    };

    this.UsuariosService.validacionDeProcesosInsertar(Attributos, Grupo);
  };

  salirYRestablecer = () => {
    this.store.dispatch(LoadListaUsuarios({ consulta: null }));
    this.modalService.dismissAll();
  };

  cerrarModales = () =>{
    this.modalService.dismissAll();
  }

  retornarStringSiexiste = (object, attribute) => {
    return retornarStringSiexiste(object, attribute);
  };

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

  filtrar = () => {
    this.spinner.show();

    this.paginaActualUsuarios= 1

    this.filtroActivo = true;
    let FiltrarRol = null;

    let FiltrarArea = null;

    if (this.selectedItemsFiltroaPermisos.length !== 0) {
      let arrayFiltroRol = [];
      this.selectedItemsFiltroaPermisos.forEach((e) => {
        arrayFiltroRol.push(e.item_id);
      });

      FiltrarRol = arrayFiltroRol;
    }

    if (this.selectedItemsFiltroAreas.length !== 0) {
      let arrayFiltroArea = [];
      this.selectedItemsFiltroAreas.forEach((e) => {
        arrayFiltroArea.push(e.item_id);
      });

      FiltrarArea = arrayFiltroArea;
    }

    let FiltrarCorreo = null;

    if (this.selectedItemsFiltroCorreos.length !== 0) {
      let arrayFiltroCorreo = [];
      this.selectedItemsFiltroCorreos.forEach((e) => {
        arrayFiltroCorreo.push(e.item_id);
      });

      FiltrarCorreo = arrayFiltroCorreo;
    }

    this.ListadoUsuariosPantalla = this.UsuariosService.filtrarUsuariosConAtributos(
      this.ListadoUsuariosOriginal,
      FiltrarRol,
      FiltrarArea,
      FiltrarCorreo
    );
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  };


  darDeBajaUsuario = () =>{
    this.UsuariosService.eliminarUsuarioPromesa(this.ObjectUsuarioCambiar.Username).then( () => {
      this.cerrarModales();
      this.store.dispatch(LoadListaUsuarios({ consulta: null }));
    })
  }
}
