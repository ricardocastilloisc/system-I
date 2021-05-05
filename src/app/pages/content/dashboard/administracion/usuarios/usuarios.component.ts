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

  Negocios = [
    ENegocio.Afore,
    ENegocio.Fondos,
    ENegocio.Seguros,
  ];

  ObjectUsuarioCambiar: UsuarioListado;

  EstadoProceso: Subscription;
  ListadoUsuarios$: Subscription;

  ListadoUsuariosOriginal: UsuarioListado[] = [];
  ListadoUsuariosPantalla: UsuarioListado[] = [];

  insertarValores = false;


  grupoPertenece = '';


  dropdownList = [];
  selectedItems = [];
  dropdownSettings:IDropdownSettings = {};


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

    this.store.dispatch(LoadListaUsuarios({ consulta: null }));



    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      allowSearchFilter: false,
      enableCheckAll: false,
      maxHeight:200,
    }


    /*

          limitSelection?: number;
      searchPlaceholderText?: string;
      noDataAvailablePlaceholderText?: string;
      closeDropDownOnSelection?: boolean;
      showSelectedItemsAtTop?: boolean;
      defaultOpen?: boolean;
      allowRemoteDataSearch?: boolean;

    */

  }


  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }


  openModal(content, ObjectUsuario: UsuarioListado, grupoPertenece) {
    this.ObjectUsuarioCambiar = ObjectUsuario;
    this.grupoPertenece = grupoPertenece;
    if (!retornarStringSiexiste(ObjectUsuario.Attributes, 'custom:rol')) {
      this.FormCambioPermiso.get('rolCambiar').setValue('Permiso');
    } else {
      if (ObjectUsuario.Attributes['custom:rol'] === '') {
        this.FormCambioPermiso.get('rolCambiar').setValue('Permiso');
      } else {
        this.FormCambioPermiso.get('rolCambiar').setValue(
          ObjectUsuario.Attributes['custom:rol']
        );
      }
    }

    if (!retornarStringSiexiste(ObjectUsuario.Attributes, 'custom:negocio')) {
      this.FormCambioPermiso.get('negocioCambiar').setValue('negocio');
    } else {
      if (ObjectUsuario.Attributes['custom:negocio'] === '') {
        this.FormCambioPermiso.get('negocioCambiar').setValue('negocio');
      } else {
        this.FormCambioPermiso.get('negocioCambiar').setValue(
          ObjectUsuario.Attributes['custom:negocio']
        );
      }
    }
    if (this.grupoPertenece === '') {
      this.FormCambioPermiso.get('areaCambiar').setValue('area');
    } else {
      this.FormCambioPermiso.get('areaCambiar').setValue(
        this.grupoPertenece
      );
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  guardarCambioPermisoUsuario = () => {
    if (
      this.FormCambioPermiso.get('rolCambiar').value === 'Permiso' &&
      this.FormCambioPermiso.get('negocioCambiar').value === 'negocio'
    ) {
      return;
    }

    const UserAttributes = [
      {
        Name: 'custom:negocio',
        Value: this.FormCambioPermiso.get('negocioCambiar').value,
      },
      {
        Name: 'custom:rol',
        Value: this.FormCambioPermiso.get('rolCambiar').value,
      },
    ];

    const Grupo = {
      grupo: this.FormCambioPermiso.get('areaCambiar').value,
      usuario: this.ObjectUsuarioCambiar.Username,
    };


    /*
    this.UsuariosService.actualizarAtributosUsuario(
      UserAttributes,
      this.ObjectUsuarioCambiar.Username
    )
      .then(() => {
        this.salirYRestablecer();
      })
      .catch(() => {
        this.salirYRestablecer();
      });
      */
  };

  salirYRestablecer = () => {
    this.store.dispatch(LoadListaUsuarios({ consulta: null }));
    this.modalService.dismissAll();
  };

  cambiarValorDelPermiso = () => {
    this.UsuariosService.agregarUsuarioGrupo(
      this.FormCambioPermiso.get('grupoCambiar').value,
      this.ObjectUsuarioCambiar.Username
    )
      .then(() => {
        this.salirYRestablecer();
      })
      .catch(() => {
        this.salirYRestablecer();
      });
  };

  retornarStringSiexiste = (object, attribute) => {
    return retornarStringSiexiste(object, attribute);
  };

  filtrar = () => {
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
