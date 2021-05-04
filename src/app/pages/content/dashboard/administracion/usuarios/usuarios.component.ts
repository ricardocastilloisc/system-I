import { EArea } from './../../../../../validators/roles';
import { ConsultaUsuario } from './../../../../../ReduxStore/reducers/listaUsuarios.reducer';
import {
  LoadListaUsuarios,
  UnsetListaUsuarios,
} from './../../../../../ReduxStore/actions/listaUsuarios.actions';
import { AppState } from './../../../../../ReduxStore/app.reducers';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UsuarioListado } from 'src/app/model/usuarioLitsa.model';
import { retornarStringSiexiste } from '../../../../../helpers/FuncionesUtiles';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ERole, ENegocio } from 'src/app/validators/roles';
import { ValorFiltrarGrupo } from '../../../../../validators/opcionesDeFiltroUsuarioAdmininistracion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../../../../services/usuarios.service';
import { ProcesoLimpiar } from '../../../../../ReduxStore/actions/loaderProcesoCambios.actions';

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
    EArea.Tesoreria
  ];

  Negocios = [
    ENegocio.Afore,
    ENegocio.Fondos,
    ENegocio.Seguros,
    ENegocio.Afore_Fondos
  ];

  ObjectUsuarioCambiar: UsuarioListado;

  EstadoProceso: Subscription;
  ListadoUsuarios$: Observable<UsuarioListado[]>;

  insertarValores = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private UsuariosService: UsuariosService
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetListaUsuarios());
    this.EstadoProceso.unsubscribe();
  }

  openModal(content, ObjectUsuario: UsuarioListado) {
    this.ObjectUsuarioCambiar = ObjectUsuario;
    if (ObjectUsuario.GrupoQuePertenece === '') {
      this.FormCambioPermiso.get('grupoCambiar').setValue('Permiso');
    } else {
      this.FormCambioPermiso.get('grupoCambiar').setValue(
        ObjectUsuario.GrupoQuePertenece
      );
    }

    if (!retornarStringSiexiste(ObjectUsuario.Attributes, 'custom:area')) {
      this.FormCambioPermiso.get('area').setValue('area');
    } else {
      if (ObjectUsuario.Attributes['custom:area'] === '') {
        this.FormCambioPermiso.get('area').setValue('area');
      } else {
        this.FormCambioPermiso.get('area').setValue(
          ObjectUsuario.Attributes['custom:area']
        );
      }
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  guardarCambioPermisoUsuario = () => {
    if (
      this.FormCambioPermiso.get('grupoCambiar').value === 'Permiso' &&
      this.FormCambioPermiso.get('area').value === 'area'
    ) {
      return;
    }

    let procesos = {
      Grupo: {
        GroupName: this.ObjectUsuarioCambiar.GrupoQuePertenece,
        Username: this.ObjectUsuarioCambiar.Username,
      },
    };

    this.UsuariosService.validacionDeProcesosEliminar(1, procesos);
    //this.UsuariosService.validacionDeProcesos(Object.keys(this.FormCambioPermiso.value).length);
    /*
    this.UsuariosService.eliminarUsuarioGrupo(
      this.ObjectUsuarioCambiar.GrupoQuePertenece,
      this.ObjectUsuarioCambiar.Username
    );
 */
  };

  salirYRestablecer = () => {
    this.store.dispatch(LoadListaUsuarios({ consulta: null }));
    this.modalService.dismissAll();
  };

  ngOnInit(): void {
    this.FiltroUsuarioForm = this.fb.group({
      grupo: ['area'],
    });
    this.FormCambioPermiso = this.fb.group({
      grupoCambiar: ['Permiso'],
      area: ['area'],
    });

    this.ListadoUsuarios$ = this.store.select(
      ({ ListaUsuarios }) => ListaUsuarios.ListaUsuarios
    );

    this.store.dispatch(LoadListaUsuarios({ consulta: null }));

    this.EstadoProceso = this.store
      .select(({ ProcesoCambios }) => ProcesoCambios.terminado)
      .subscribe((estado) => {
        if (estado) {
          this.cambiarValorDelPermiso();
          this.store.dispatch(ProcesoLimpiar());
        }
        /*
        if (estado && !this.insertarValores) {
          this.cambiarValorDelPermiso();
          this.store.dispatch(ProcesoLimpiar());
          this.insertarValores = true;
        }

        if (estado && this.insertarValores) {
          this.cambiarValorDelPermiso();
          this.store.dispatch(ProcesoLimpiar());
          this.insertarValores = false;
        }
*/
      });
  }

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
    if (this.FiltroUsuarioForm.get('grupo').value === 'Permiso') {
      return;
    }
    let consulta: ConsultaUsuario = {
      parametro: this.FiltroUsuarioForm.get('grupo').value,
      tipo: ValorFiltrarGrupo.Grupo,
    };
    this.store.dispatch(LoadListaUsuarios({ consulta: consulta }));
  };
}
