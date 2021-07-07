import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../ReduxStore/app.reducers';
import { Usuario } from 'src/app/model/usuario.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { UsuariosService } from '../../../../services/usuarios.service';
import { APIService } from '../../../../API.service';
import { EArea } from '../../../../validators/roles';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {
  DataUser$: Observable<Usuario>;
  DataUser: Usuario;

  flagAdministracion = false;
  flagAdminCatalogos = false;
  flagAdminUsuarios = false;
  flagAdminNotificaciones = false;
  flagProcesos = false;
  flagProcesosDiurnos = false;
  flagProcesosNocturnos = false;
  flagAuditoria = false;
  flagAuditoriaInterfaces = false;
  flagAuditoriaCatalogos = false;
  flagAuditoriaProcesos = false;
  flagAuditoriaUsuarios = false;

  constructor(
    private store: Store<AppState>,
    private usuario: UsuariosService,
    private authService: AuthService,
    private api: APIService
  ) { }

  ngOnInit(): void {
    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.validarPermisosPerfil();
  }

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  }

  perfilValido = (User: Usuario, roles: any[]): boolean => {
    return this.authService.perfilValido(User, roles);
  }

  ocultarFuncionalidad(): void {
    this.flagAdministracion = false;
    this.flagAdminCatalogos = false;
    this.flagAdminUsuarios = false;
    this.flagAdminNotificaciones = false;
    this.flagProcesos = false;
    this.flagProcesosDiurnos = false;
    this.flagProcesosNocturnos = false;
    this.flagAuditoria = false;
    this.flagAuditoriaInterfaces = false;
    this.flagAuditoriaCatalogos = false;
    this.flagAuditoriaProcesos = false;
    this.flagAuditoriaUsuarios = false;
  }

  obtenerBanderaPermiso(item: any): boolean {
    let flag = false;
    if (item !== undefined && item !== null) {
      if (Object.keys(item).length !== 0) {
        flag = true;
      }
    }
    return flag;
  }

  asignarBanderaPadre(): void {
    if (this.flagAdminCatalogos === true || this.flagAdminUsuarios === true || this.flagAdminNotificaciones === true) {
      this.flagAdministracion = true;
    }
    if (this.flagProcesosDiurnos === true || this.flagProcesosNocturnos === true) {
      this.flagProcesos = true;
    }
    // tslint:disable-next-line: max-line-length
    if (this.flagAuditoriaInterfaces === true || this.flagAuditoriaCatalogos === true || this.flagAuditoriaProcesos === true || this.flagAuditoriaUsuarios === true) {
      this.flagAuditoria = true;
    }
  }

  validarPermisosPerfil(): void {
    const autenticado = this.usuario.validarRolUsuario();
    if (autenticado) {
      this.store
        .select(({ usuario }) => usuario.user)
        .subscribe((user) => {
          if (user) {
            this.DataUser = user;
            const areas = [
              EArea.Tesoreria,
              EArea.Inversiones_Riesgos,
              EArea.Contabilidad,
              EArea.Custodia,
              EArea.Soporte,
            ];
            const areasStore = [];
            user.attributes['cognito:groups'].forEach((e) => {
              if (areas.includes(e)) {
                areasStore.push(e.toUpperCase());
              }
            });
            const area = areasStore[0];
            const negocios = this.DataUser.attributes['custom:negocio'].toUpperCase().split(',');
            const rol = this.DataUser.attributes['custom:rol'].toUpperCase();
            this.api.ListCATPERMISOS(negocios, area, rol).then(({ items }: any) => {
              if (Object.keys(items).length !== 0) {
                const catalogos = items.find(ai => ai.CATALOGOS.CONSULTAR === true);
                const usuarios = items.find(ai => ai.USUARIOS.CONSULTAR === true);
                const notificaciones = items.find(ai => ai.CATALOGOS.CONSULTAR === true);
                const diurnos = items.find(ai => ai.PROCESOS.MONITOREAR === true);
                const nocturnos = items.find(ai => ai.PROCESOS.MONITOREAR === true);
                const interfaces = items.find(ai => ai.AUDITORIA.ARCHIVOS === true);
                const audCatalogos = items.find(ai => ai.AUDITORIA.CATALOGOS === true);
                const audUsuarios = items.find(ai => ai.USUARIOS.CONSULTAR === true);
                const audProcesos = items.find(ai => ai.PROCESOS.MONITOREAR === true);
                this.flagAdminCatalogos = this.obtenerBanderaPermiso(catalogos);
                this.flagAdminUsuarios = this.obtenerBanderaPermiso(usuarios);
                this.flagAdminNotificaciones = this.obtenerBanderaPermiso(notificaciones);
                this.flagProcesosDiurnos = this.obtenerBanderaPermiso(diurnos);
                this.flagProcesosNocturnos = this.obtenerBanderaPermiso(nocturnos);
                this.flagAuditoriaInterfaces = this.obtenerBanderaPermiso(interfaces);
                this.flagAuditoriaCatalogos = this.obtenerBanderaPermiso(audCatalogos);
                this.flagAuditoriaProcesos = this.obtenerBanderaPermiso(audProcesos);
                this.flagAuditoriaUsuarios = this.obtenerBanderaPermiso(audUsuarios);
                this.asignarBanderaPadre();
              } else {
                this.ocultarFuncionalidad();
              }
            });
          }
        });
    } else {
      this.ocultarFuncionalidad();
    }
  }

}
