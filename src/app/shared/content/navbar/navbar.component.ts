import { unSetnotificaciones } from './../../../ReduxStore/actions/notificaciones.actions';
import { UsuariosService } from './../../../services/usuarios.service';
import { rutasConNombres } from './../../../helpers/rutas';
import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AppState } from '../../../ReduxStore/app.reducers';
import { Usuario } from '../../../model/usuario.model';
import { Observable, Subscription, interval } from 'rxjs';
import { EArea, ERole } from '../../../validators/roles';
import { NotificacionesService } from '../../../services/notificaciones.service';
import { map } from 'rxjs/operators';
import { NOTIFICACION_INTERFACE } from './../../../model/notificacion.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { APIService } from '../../../API.service';
import { ProcesosService } from 'src/app/services/procesos.service';
import { notificacionSelect } from '../../../ReduxStore/actions/notificacionSelect/notificacionSelect.actions';
declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  DataUser$: Observable<Usuario>;
  subscription: Subscription;
  Administrador = ERole.Administrador;
  Monitor = ERole.Monitor;
  Soporte = ERole.Soporte;
  Notificaciones$: Observable<NOTIFICACION_INTERFACE[]>;
  Notificaciones: NOTIFICACION_INTERFACE[] = [];
  NotificacionesEstaticos: NOTIFICACION_INTERFACE[] = [];
  NotificacionesSub$: Subscription;
  NotificacionesSubActivo$;
  DataUser: Usuario;
  DataUserValidartor;
  negocios = [];
  area: string;
  ValidadoresDeInterfaces;
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
  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
    EArea.Soporte,
  ];
  navClick = {
    navAdministracion: false,
    navProceso: false,
    navAudiroria: false,
  };


  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private usuario: UsuariosService,
    private NotificacionesService: NotificacionesService,
    private router: Router,
    private toastr: ToastrService,
    private api: APIService,
    private ProcesosService: ProcesosService
  ) { }

  clickNav = ({ target }) => {
    this.navClick[target.id] = !this.navClick[target.id];
    Object.keys(this.navClick).forEach((elemtnoNav) => {
      if (elemtnoNav !== target.id) {
        if (this.navClick[elemtnoNav]) {
          this.navClick[elemtnoNav] = !this.navClick[elemtnoNav];
          $('#' + elemtnoNav).click();
        }
      }
    });
  }

  ngOnDestroy(): void {

    if (this.NotificacionesSubActivo$) {
      this.NotificacionesSubActivo$.unsubscribe();
    }

    this.store.dispatch(unSetnotificaciones());

    if (this.NotificacionesSub$) {
      this.NotificacionesSub$.unsubscribe();
    }
    this.DataUserValidartor.unsubscribe();
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.resizeMenuContent();
  }

  arrayRuta = () => {
    let ArrayRuta = [];

    window.location.pathname.split('/').forEach((elementoRuta) => {
      let coincidencia = false;
      rutasConNombres.forEach((elementoValidar) => {
        if (elementoRuta === elementoValidar.rutaAngular) {
          coincidencia = true;
          ArrayRuta.push(elementoValidar.ValorEsp);
        }
      });
      if (!coincidencia && elementoRuta !== '') {
        let ruta = '';
        ruta = elementoRuta.split('%20').join(' ').toString();
        ruta = ruta.split('%C3%A1').join('á').toString();
        ruta = ruta.split('%C3%A9').join('é').toString();
        ruta = ruta.split('%C3%AD').join('í').toString();
        ruta = ruta.split('%C3%B3').join('ó').toString();
        ruta = ruta.split('%C3%B1').join('ñ').toString();
        ArrayRuta.push(ruta);
      }
    });
    return ArrayRuta;
  }

  retornarColor = (ArrayRuta) => {
    let nombreRuta = ArrayRuta.join('/').toString();

    let returnColor = '';
    if (nombreRuta.includes('Administración')) {
      returnColor = 'verde';
    } else if (nombreRuta.includes('Auditoría')) {
      returnColor = 'azul';
    } else if (nombreRuta.includes('Procesos')) {
      returnColor = 'morado';
    } else {
      returnColor = 'verde';
    }
    return returnColor;
  }

  retornarClaseCorrecta = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'alineadoTextoIzquierda';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'alineadoTextoIzquierdaMorado';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'alineadoTextoIzquierdaAzul';
    }
  }

  retornarClaseCorrectaDrecha = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'alineadoTextoDerecha';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'alineadoTextoDerechaMorado';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'alineadoTextoDerechaAzul';
    }
  }

  retornarClaseCorrectaLinea = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'linea';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'linea-morado';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'linea-azul';
    }
  }

  retornarIconoCorrecto = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return 'assets/icons/nav/inicio.svg';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return 'assets/icons/nav/procesos.svg';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return 'assets/icons/nav/auditoria.svg';
    }
  }

  colorCamppanaCorrecto = () => {
    if (this.retornarColor(this.arrayRuta()) === 'verde') {
      return '#00c4d9';
    }

    if (this.retornarColor(this.arrayRuta()) === 'morado') {
      return '#7c69c3';
    }

    if (this.retornarColor(this.arrayRuta()) === 'azul') {
      return '#0091da';
    }
  }
  irRutaDeStringRuta = (index) => {
    const ArrayUrl = window.location.pathname.split('/');

    let url = '';

    if (index === 0) {
      for (let i = 1; i < index + 3; i++) {
        url = url + '/' + ArrayUrl[i];
      }
    } else {
      for (let i = 1; i < index + 2; i++) {
        url = url + '/' + ArrayUrl[i];
      }
    }
    this.router.navigateByUrl(url);
  }

  eliminarNotificacion = (ID_PROCESO: string) => {
    this.NotificacionesService.eliminarNoticiaciones(ID_PROCESO);
    $('#dLabel').click();
  }

  ngOnInit(): void {
    this.validarPermisosPerfil();
    const source = interval(1800000);
    this.subscription = source.subscribe((val) =>
      this.authService.refreshToken()
    );

    this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
    this.NotificacionesSub$ = this.store
      .select(({ notificaciones }) => notificaciones.notificaciones)
      .pipe(
        map((e) => {
          if (e) {
            return e.filter((fl) => fl.LEIDO === false);
          }
        })
      )
      .subscribe((res) => {
        this.Notificaciones = res;
        if (this.Notificaciones) {
          if (this.Notificaciones.length > 0) {
            new Promise((resolve) => {
              const intervalo = setInterval(() => {
                if (this.ValidadoresDeInterfaces) {
                  resolve('ok');
                  clearInterval(intervalo);
                }
              }, 100);
            }).then(() => {
              let NotificacionFinal = [];
              this.ValidadoresDeInterfaces.forEach((e) => {
                let array = this.Notificaciones.filter(
                  (f) => f['INTERFAZ'] === e['FLUJO']
                );
                if (array.length > 0) {
                  NotificacionFinal = [...NotificacionFinal, ...array];
                }
              });
              localStorage.setItem(
                'Notificaciones',
                JSON.stringify(NotificacionFinal)
              );
              this.Notificaciones = NotificacionFinal;
            });
          }
        }
      });

    this.DataUserValidartor = this.store
      .select(({ usuario }) => usuario.user)
      .subscribe((res) => {
        if (res) {
          this.DataUser = res;

          this.area = this.obtenerAreaValidacion();

          let prenegocios = this.DataUser.attributes['custom:negocio'];

          if (prenegocios !== undefined) {
            this.negocios =
              this.DataUser.attributes['custom:negocio'].split(',');
          }

          this.negocios = this.negocios.map((negocio) => {
            return negocio.toUpperCase();
          });

          if (prenegocios !== undefined) {

            this.NotificacionesService.obtenerListadoDeNotificaciones();

            this.api
              .ListCATPERMISOS(
                this.negocios,
                this.area,
                this.DataUser.attributes['custom:rol'].toUpperCase()
              )
              .then(({ items }: any) => {
                this.ValidadoresDeInterfaces = items;
                this.NotificacionesSubActivo$ =
                  this.api.OnUpdateSiaGenAudEstadoProcesosDevListener.subscribe(
                    ({ value }: any) => {
                      const { data } = value;
                      const { onUpdateSiaGenAudEstadoProcesosDev } = data;
                      let arrayValidador = this.ValidadoresDeInterfaces.filter(
                        (e) =>
                          e['FLUJO'] ===
                          onUpdateSiaGenAudEstadoProcesosDev['INTERFAZ']
                      );

                      this.validarPantallaEnProcesos(data);
                      if (arrayValidador.length > 0) {
                        if (
                          onUpdateSiaGenAudEstadoProcesosDev[
                          'ESTADO_EJECUCION'
                          ] === 'TERMINADO'
                        ) {
                          let tempNoticicaciones = JSON.parse(
                            localStorage.getItem('Notificaciones')
                          );
                          if (
                            tempNoticicaciones.filter(
                              (e) =>
                                e.ID_PROCESO ===
                                onUpdateSiaGenAudEstadoProcesosDev.ID_PROCESO
                            ).length < 1
                          ) {
                            if (
                              this.verEstado(
                                onUpdateSiaGenAudEstadoProcesosDev
                              ) === 'EXITOSO'
                            ) {
                              this.abrirToass(
                                this.verEstado(
                                  onUpdateSiaGenAudEstadoProcesosDev
                                ),
                                onUpdateSiaGenAudEstadoProcesosDev.INTERFAZ
                              );
                            } else {
                              this.abrirToassError(
                                this.verEstado(
                                  onUpdateSiaGenAudEstadoProcesosDev
                                ),
                                onUpdateSiaGenAudEstadoProcesosDev.INTERFAZ
                              );
                            }

                            this.NotificacionesService.newNotificacion(
                              onUpdateSiaGenAudEstadoProcesosDev
                            );
                          }
                        }
                      }
                    }
                  );
              });
          }
        }
      });
  }

  signOut = () => {
    localStorage.setItem('SIA', 'false');
    this.authService.signOut();
    this.usuario.logout();
  }

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  }

  perfilValido = (User: Usuario, roles: any[]): boolean => {
    return this.authService.perfilValido(User, roles);
  }

  toggle = () => {
    $('#sidebar').toggleClass('active');
    this.resizeMenuContent();
  }

  resizeMenuContent = () => {


    $( window ).resize(()  =>{
      if (window.innerWidth < 769) {
        if ($('#sidebar').hasClass('active')) {
          $('#content').css('margin-left', '253px');
          $('#headernav').css('width', window.innerWidth + 'px');
        } else {
          $('#content').css('margin-left', '0px');
          $('#headernav').css('width', '100%');
        }
      } else {
        if ($('#sidebar').hasClass('active')) {
          $('#content').css('margin-left', '0px');
          $('#content').css('width', '100%');
          $('#headernav').css('width', '100%');
        } else {
          $('#content').css('margin-left', '253px');
          $('#content').css('width', '85%');
          $('#headernav').css('width', window.innerWidth - 253 + 'px');
        }
      }
    });



  }

  irAlProceso = (data: NOTIFICACION_INTERFACE) => {
    const url = 'procesos/diurno/' + data.INTERFAZ;
    localStorage.setItem('notProcesos', 'true');
    this.store.dispatch(notificacionSelect({ notificacionSelect: data }));
    this.router.navigateByUrl(url).then(() => {
      this.eliminarNotificacion(data.ID_PROCESO);
    });
  }

  verEstado = (data: NOTIFICACION_INTERFACE) => {
    if (data.ETAPA_FINAL_ESTADO_FINAL) {
      return data.ETAPA_FINAL_ESTADO_FINAL;
    }

    if (data.ETAPA_PROCESAMIENTO_ESTADO_FINAL) {
      return data.ETAPA_PROCESAMIENTO_ESTADO_FINAL;
    }

    if (data.ETAPA_INICIAL_ESTADO_FINAL) {
      return data.ETAPA_INICIAL_ESTADO_FINAL;
    }

    return '';
  }

  replazarCaracterEspecial = (value) => {
    return new Date(value + 'Z').toString();
  }

  abrirToassError = (estado, err) => {
    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><div class="col-12 tamanioFont" ><img class="iconErrorRegistro"/>PROCESO ';
    mensaje = mensaje + estado + '</div> <div class="col-12">';

    mensaje = mensaje + err;

    mensaje = mensaje + '</div>';

    this.toastr.show(mensaje, null, {
      toastClass: 'etiquetaErrorRegistro row justify-content-center',
      positionClass: 'toast-top-right',
      timeOut: 3500,
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  abrirToass = (estado, msn) => {
    this.arrayRuta();

    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><div class="col-12 tamanioFont" ><img class="successRegistro"/>PROCESO ';

    mensaje = mensaje + estado + '</div> <div class="col-12 tamanioFont">';

    mensaje = mensaje + msn;

    mensaje = mensaje + '</div>';

    this.toastr.show(mensaje, null, {
      toastClass:
        'etiquetaAddRegistro etiquetaAddRegistro row justify-content-center',
      positionClass: 'toast-top-right',
      timeOut: 3500,
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  obtenerAreaValidacion(): string {
    let arrayTempArea = [];

    this.DataUser.groups.forEach((area) => {
      this.Areas.forEach((areaDef) => {
        if (area === areaDef) {
          arrayTempArea.push(area);
        }
      });
    });
    if (arrayTempArea.length > 0) return arrayTempArea[0].toUpperCase();
    else 'N/D';
  }

  obtenerArea(): any {
    let area: String = '';
    this.store
      .select(({ usuario }) => usuario.area)
      .subscribe((res) => {
        area = res;
      });
    return area;
  }

  estadoActualizar = (data: NOTIFICACION_INTERFACE) => {
    if (data.ETAPA_FINAL_ESTADO_FINAL) {
      if (
        data.ETAPA_FINAL_ESTADO_FINAL === 'EXITOSO' ||
        data.ETAPA_FINAL_ESTADO_FINAL === 'FALLIDO'
      ) {
        return data.ETAPA_FINAL_ESTADO_FINAL;
      }
    }

    if (data.ETAPA_PROCESAMIENTO_ESTADO_FINAL) {
      if (data.ETAPA_PROCESAMIENTO_ESTADO_FINAL === 'FALLIDO') {
        return data.ETAPA_PROCESAMIENTO_ESTADO_FINAL;
      }
    }

    if (data.ETAPA_INICIAL_ESTADO_FINAL) {
      if (data.ETAPA_INICIAL_ESTADO_FINAL === 'FALLIDO') {
        return data.ETAPA_INICIAL_ESTADO_FINAL;
      }
    }

    return null;
  }

  validarPantallaEnProcesos(data: any): void {
    const ruta = this.arrayRuta()[0];
    let idPantalla;
    let idNotificacion;
    if (ruta.includes('Procesos')) {
      this.store
        .select(
          ({ AUDGENEJECUCIONESPROCESO }) =>
            AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
        )
        .subscribe((res) => {
          if (res) {
            idPantalla = res.ID_PROCESO;
            if (data.onUpdateSiaGenAudEstadoProcesosDev.ID_PROCESO) {
              idNotificacion =
                data.onUpdateSiaGenAudEstadoProcesosDev.ID_PROCESO;
              if (idPantalla === idNotificacion) {
                let estado = this.estadoActualizar(
                  data.onUpdateSiaGenAudEstadoProcesosDev
                );
                if (estado !== null) {
                  const message = {
                    idProceso: idPantalla,
                    estado: 'CONTINUAR',
                  };
                  this.ProcesosService.sendUpdate(JSON.stringify(message));
                }
              }
            }
          }
        });
    }
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
