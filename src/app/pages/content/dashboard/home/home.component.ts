import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { ERole } from 'src/app/validators/roles';
import { ProcesosService } from 'src/app/services/procesos.service';
import { AuditoriaService } from '../../../../services/auditoria.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  DataUser$: Observable<Usuario>;
  Administrador = ERole.Administrador;
  Ejecutor = ERole.Ejecutor;

  constructor(
    private store: Store<AppState>,
    private usuario: UsuariosService,
    private authService: AuthService,
    private auditoria: AuditoriaService,
    private procesos: ProcesosService
  ) { }

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.usuario.obtenerDetalleUsuario();
    //this.usuario.actualizarme();
    //this.auditoria.enviarMensaje();
    //this.procesos.iniciarProceso('aims', 'galicia.brenda@principal.com', 'Soporte');
  }

  rolesValids = (User:Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids( User, roles);
  };

}
