import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { ERole } from '../../../../validators/roles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  DataUser$: Observable<Usuario>;

  Administrador = ERole.Administrador;
  AdministradorArea = ERole.AdministradorArea;
  Ejecutor = ERole.Ejecutor;
  Soporte = ERole.Soporte;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService,
    private usuario: UsuariosService
  ) { }

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.usuario.obtenerDetalleUsuario();
    var bandera = this.usuario.validarRolUsuario();
    console.log("bandera: " + bandera);
  }


  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  }
}
