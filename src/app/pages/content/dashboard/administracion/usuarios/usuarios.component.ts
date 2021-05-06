import { ProcesoLimpiar } from './../../../../../ReduxStore/actions/loaderProcesoCambios.actions';
import { EArea } from './../../../../../validators/roles';
import { ConsultaUsuario } from './../../../../../ReduxStore/reducers/listaUsuarios.reducer';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { ERole, ENegocio } from 'src/app/validators/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../../../../services/usuarios.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  FiltroUsuarioForm: FormGroup;
  FormCambioPermiso: FormGroup;

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
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
  ];

  Permisos = [ERole.Administrador, ERole.Ejecutor, ERole.Soporte];

  Negocios = [ENegocio.Afore, ENegocio.Fondos, ENegocio.Seguros];

  ObjectUsuarioCambiar: UsuarioListado;

  EstadoProceso: Subscription;
  ListadoUsuarios$: Subscription;

  ListadoUsuariosOriginal: UsuarioListado[] = [];
  ListadoUsuariosPantalla: UsuarioListado[] = [];

  insertarValores = false;

  grupoPertenece = '';

  dropdownListCambioDeNegocio = [];

  SettingsCambioDeNegocio: IDropdownSettings = {};

  ///aqui va ir los inputs que se iniciaran para el modal

  selectedItemsCambioDeNegocio = [];
  SelectCamabiarPermiso = 'Permiso';
  SelectCamabiarArea = 'Area';

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private UsuariosService: UsuariosService
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetListaUsuarios());
    this.ListadoUsuarios$.unsubscribe();
  }

  ngOnInit(): void {
    this.FiltroUsuarioForm = this.fb.group({
      rolFiltrar: ['Permiso'],
      areaFiltrar: ['area'],
      correoFiltrar: ['correo'],
    });
    this.FormCambioPermiso = this.fb.group({
      rolCambiar: ['Permiso'],
      negocioCambiar: ['negocio'],
      areaCambiar: ['area'],
    });

    this.ListadoUsuarios$ = this.store
      .select(({ ListaUsuarios }) => ListaUsuarios.ListaUsuarios)
      .subscribe((ListadoDeUsuarios) => {
        this.ListadoUsuariosOriginal = ListadoDeUsuarios;
        this.ListadoUsuariosPantalla = ListadoDeUsuarios;
      });

    this.initicializarLosSelects();

    this.store.dispatch(LoadListaUsuarios({ consulta: null }));

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

    this.SettingsCambioDeNegocio = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      enableCheckAll: false,
      maxHeight: 200,
    };
  };

  openModal(content, ObjectUsuario: UsuarioListado, grupoPertenece) {
    this.ObjectUsuarioCambiar = ObjectUsuario;
    this.grupoPertenece = grupoPertenece;

    /*

      this.selectedItemsCambioDeNegocio = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
    ];


    */
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

  retornarStringSiexiste = (object, attribute) => {
    return retornarStringSiexiste(object, attribute);
  };

  filtrar = () => {
    //console.log(this.selectedItems);
    
    let FiltrarRol =
      this.FiltroUsuarioForm.get('rolFiltrar').value === 'Permiso'
        ? null
        : this.FiltroUsuarioForm.get('rolFiltrar').value;
    let FiltrarArea =
      this.FiltroUsuarioForm.get('areaFiltrar').value === 'area'
        ? null
        : this.FiltroUsuarioForm.get('areaFiltrar').value;
    let FiltrarCorreo =
      this.FiltroUsuarioForm.get('correoFiltrar').value === 'correo'
        ? null
        : this.FiltroUsuarioForm.get('correoFiltrar').value;

    this.ListadoUsuariosPantalla = this.UsuariosService.filtrarUsuariosConAtributos(
      this.ListadoUsuariosOriginal,
      FiltrarRol,
      FiltrarArea,
      FiltrarCorreo
    );
  };
}
