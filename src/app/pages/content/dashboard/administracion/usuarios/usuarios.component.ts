import { ConsultaUsuario } from './../../../../../ReduxStore/reducers/listaUsuarios.reducer';
import {
  LoadListaUsuarios,
  UnsetListaUsuarios,
} from './../../../../../ReduxStore/actions/listaUsuarios.actions';
import { AppState } from './../../../../../ReduxStore/app.reducers';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UsuarioListado } from 'src/app/model/usuarioLitsa.model';
import { retornarStringSiexiste } from '../../../../../helpers/FuncionesUtiles';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ERole } from 'src/app/validators/roles';
import { ValorFiltrarGrupo } from '../../../../../validators/opcionesDeFiltroUsuarioAdmininistracion';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  ListadoUsuarios$: Observable<UsuarioListado[]>;

  FiltroUsuarioForm: FormGroup;
  FormCambioPermiso: FormGroup;

  Grupos = [
    {
      label: 'Administrador',
      value: ERole.Administrador,
    },
    {
      label: 'Administrador de área',
      value: ERole.AdministradorArea,
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

  ObjectUsuarioCambiar: UsuarioListado;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private UsuariosService: UsuariosService
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(UnsetListaUsuarios());
  }

  openModal(content, ObjectUsuario: UsuarioListado) {
    this.ObjectUsuarioCambiar = ObjectUsuario;
    console.log(ObjectUsuario);
    if (ObjectUsuario.GrupoQuePertenece === '') {
      this.FormCambioPermiso.get('grupoCambiar').setValue('Permiso');
    } else {
      this.FormCambioPermiso.get('grupoCambiar').setValue(
        ObjectUsuario.GrupoQuePertenece
      );
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  guardarCambioPermisoUsuario = async (modal) => {
    if (this.FormCambioPermiso.get('grupoCambiar').value === 'Permiso') {
      return;
    }

    if(this.ObjectUsuarioCambiar.GrupoQuePertenece === ''){
      this.UsuariosService.agregarUsuarioGrupo(
        this.FormCambioPermiso.get('grupoCambiar').value,
        this.ObjectUsuarioCambiar.Username
      )
        .then(() => {
          this.salirYRestablecer(modal);
        })
        .catch(() => {
          this.salirYRestablecer(modal);
        });
    }


    this.UsuariosService.eliminarUsuarioGrupo(
      this.ObjectUsuarioCambiar.GrupoQuePertenece,
      this.ObjectUsuarioCambiar.Username
    )
    setTimeout(() => {
      this.UsuariosService.agregarUsuarioGrupo(
        this.FormCambioPermiso.get('grupoCambiar').value,
        this.ObjectUsuarioCambiar.Username
      )
        .then(() => {
          this.salirYRestablecer(modal);
        })
        .catch(() => {
          this.salirYRestablecer(modal);
        });
    }, 500);


    /*
      .then(() => {
        () => {
          console.log('exito 1')
          this.UsuariosService.agregarUsuarioGrupo(
            this.FormCambioPermiso.get('grupoCambiar').value,
            this.ObjectUsuarioCambiar.Username
          )
            .then(() => {
              console.log('exito 2')
              this.salirYRestablecer(modal);
            })
            .catch(() => {
              console.log('error 2')
              this.salirYRestablecer(modal);
            });
        };
      })
      */
  };

  salirYRestablecer = (modal) => {
    this.store.dispatch(LoadListaUsuarios({ consulta: null }));
    this.modalService.dismissAll();
    modal.close();
  };

  ngOnInit(): void {
    this.FiltroUsuarioForm = this.fb.group({
      grupo: ['Permiso'],
    });
    this.FormCambioPermiso = this.fb.group({
      grupoCambiar: ['Permiso'],
    });

    this.ListadoUsuarios$ = this.store.select(
      ({ ListaUsuarios }) => ListaUsuarios.ListaUsuarios
    );
    this.store.dispatch(LoadListaUsuarios({ consulta: null }));
  }

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
