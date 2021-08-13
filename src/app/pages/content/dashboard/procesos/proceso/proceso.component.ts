import {
  LoadAUDGENPROCESOS,
  UnsetAUDGENPROCESO,
} from './../../../../../ReduxStore/actions/AUDGENPROCESO.actions';
import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, Subscription } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';
import { AUDGENESTADOPROCESO_INTERFACE } from '../../../../../model/AUDGENESTADOPROCESO.model';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../../../../model/usuario.model';
import { EArea, ERole } from '../../../../../validators/roles';
import {
  LoadAUDGENESTADOPROCESOS,
  UnsetAUDGENESTADOPROCESO,
  LoadAUDGENEJECUCIONESPROCESO,
  UnsetAUDGENEJECUCIONPROCESO,
} from 'src/app/ReduxStore/actions';
import { APIService } from '../../../../../API.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProcesosService } from 'src/app/services/procesos.service';
import { UsuariosService } from '../../../../../services/usuarios.service';
import { LogeoService } from '../../../../../services/logeo.service';

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.css'],
})
export class ProcesoComponent implements OnInit, OnDestroy {
  @ViewChild('modalEstado') templateRef: TemplateRef<any>;
  @ViewChild('ejecucionesInexistentes')

  templateRefEjecuciones: TemplateRef<any>;
  filtroEjecucionesForm: FormGroup;
  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
    EArea.Soporte,
  ];
  Loading$: Subscription;
  DataUser$: Observable<Usuario>;
  last;
  PROCESOS = new Array();
  ocultarbusqueda = false;
  titulo$: Observable<object>;
  titulo: string;
  area: string;
  listaProcesos: any;
  totalItems: number;
  paginaActualEjecucionesProceso: number = 1;
  paginaActualProceso: number = 1;
  mostrarEjecucionesProcesos: boolean = true;
  maxDate: Date;
  today: string;
  Administrador = ERole.Administrador;
  Ejecutor = ERole.Monitor;
  DataUser: any;
  ejemplo;
  fechaBusqueda: Date;
  fechaInicio: Date;
  fechaFin: Date;
  estado = '';
  messageReceived: any;
  private subscriptionName: Subscription;

  constructor(
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private authService: AuthService,
    private api: APIService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private spinner: NgxSpinnerService,
    private ProcesosService: ProcesosService,
    private usuario: UsuariosService,
    private logeo: LogeoService
  ) {
    this.Loading$ = this.store
      .select(({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.error)
      .subscribe((res) => {
        this.spinner.show();
        if (res) {
        } else {
          this.spinner.hide();
        }
      });
  }

  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  AUDGENEJECUCIONPROCESO$: Observable<AUDGENPROCESO_INERFACE>;
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>;

  ngOnDestroy(): void {
    this.store.dispatch(UnsetAUDGENPROCESO());
    this.store.dispatch(UnsetAUDGENESTADOPROCESO());
    this.store.dispatch(UnsetAUDGENEJECUCIONPROCESO());
    this.subscriptionName.unsubscribe();
  }

  replazarCaracterEspecial = (value) => {
    return new Date(value + 'Z').toString();
  }

  ngOnInit(): void {
    try {
      this.subscriptionName = this.ProcesosService.getUpdate().subscribe
        (message => {
          this.messageReceived = JSON.parse(message.text).idProceso;
          this.estado = JSON.parse(message.text).estado;
          if (this.estado === 'CONTINUAR') {
            this.consultarDetalle(this.messageReceived, null);
            this.estado = 'DETENER';
            this.subscriptionName.unsubscribe();
          }
        });
      this.authService.refreshToken();
      this.titulo = JSON.parse(localStorage.getItem('Titulo'));
      this.ocultarbusqueda = false;
      this.paginaActualProceso = 1;
      this.paginaActualEjecucionesProceso = 1;
      this.filtroEjecucionesForm = this.fb.group({
        fechaFiltrar: [],
        idProceso: [],
      });
      this.maxDate = new Date();
      this.fechaInicio = new Date();
      this.fechaInicio.setHours(0, 0, 0, 0);
      this.fechaFin = new Date();
      this.fechaFin.setHours(23, 59, 59, 999);
      this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
      this.DataUser$.subscribe((res) => (this.DataUser = res)).unsubscribe();
      this.AUDGENESTADOPROCESOS$ = this.store
        .select(
          ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
        )
        .pipe(
          map((res) => {
            if (res === null) { return res; }
            else {
              return res
                .slice()
                .sort(function (a, b) {
                  return (
                    new Date(b.FECHA_ACTUALIZACION).getTime() -
                    new Date(a.FECHA_ACTUALIZACION).getTime()
                  );
                })
                .filter((item, i, res) => {
                  return (
                    res.indexOf(
                      res.find((t) => t.ID_PROCESO === item.ID_PROCESO)
                    ) === i
                  );
                });
            }
          })
        );
      this.store.select(({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS);
      this.store.select(
        ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
      );
      const body = {
        INTERFAZ: this.rutaActiva.snapshot.params.id,
        FECHA_INICIO: this.fechaInicio.toISOString().replace('0Z', ''),
        FECHA_FIN: this.fechaFin.toISOString().replace('9Z', ''),
      };
      this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
      this.AUDGENESTADOPROCESOS$.subscribe((res) => {
        if (res && res.length === 0) {
          this.ejecucionesInexistentesModal();
        } else { this.cerrarModales(); }
      });
      this.store
        .select(({ notificacionSelect }) => notificacionSelect.notificacionSelect)
        .subscribe((res) => {
          const notificaciones = JSON.parse(localStorage.getItem('notProcesos'));
          if (res && notificaciones !== null) {
            this.spinner.show();
            const array = window.location.pathname.split('/');
            const bodyProcesos = {
              filter: { TIPO: { eq: array[2].toUpperCase() } },
              limit: 1000,
            };
            this.api
              .ListCATPROCESOS(bodyProcesos.filter, bodyProcesos.limit)
              .then(({ items }) => {
                this.titulo = items.filter(
                  (item) => item.PROCESO === res.INTERFAZ
                )[0].DESCRIPCION;
                this.consultarDetalle(res.ID_PROCESO, res.FECHA_CREADO);
                this.spinner.hide();
                localStorage.removeItem('notProcesos');
              });
          }
        });
      const auditoria = JSON.parse(localStorage.getItem('audProcesos'));
      if (auditoria) {
        this.spinner.show();
        const array = window.location.pathname.split('/');
        const bodyProcesos = {
          filter: { TIPO: { eq: array[2].toUpperCase() } },
          limit: 1000,
        };
        this.api
          .ListCATPROCESOS(bodyProcesos.filter, bodyProcesos.limit)
          .then(({ items }) => {
            this.titulo = auditoria.proceso;
            this.consultarDetalle(auditoria.idProceso.toLowerCase(), null);
            this.spinner.hide();
          });
        localStorage.removeItem('audProcesos');
      }
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'CARGAR PANTALLA', JSON.stringify(err));
    }
  }

  openModal() {
    this.modalService.open(this.templateRef, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  obtenerArea(): string {
    const arrayTempArea = [];
    this.DataUser.groups.forEach((area) => {
      this.Areas.forEach((areaDef) => {
        if (area === areaDef) {
          arrayTempArea.push(area);
        }
      });
    });
    if (arrayTempArea.length > 0) { return arrayTempArea[0].toUpperCase(); }
    else { 'N/D'; }
  }

  recargarEjecuciones(): void {
    try {
      if (this.mostrarEjecucionesProcesos === false) {
        this.mostrarEjecucionesProcesos = !this.mostrarEjecucionesProcesos;
      }
      this.ocultarbusqueda = false;
      this.AUDGENESTADOPROCESOS$ = this.store
        .select(
          ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
        )
        .pipe(
          map((res) => {
            if (res === null) { return res; }
            else {
              return res
                .slice()
                .sort(function (a, b) {
                  return (
                    new Date(b.FECHA_ACTUALIZACION).getTime() -
                    new Date(a.FECHA_ACTUALIZACION).getTime()
                  );
                })
                .filter((item, i, res) => {
                  return (
                    res.indexOf(
                      res.find((t) => t.ID_PROCESO === item.ID_PROCESO)
                    ) === i
                  );
                });
            }
          })
        );
      const body = {
        INTERFAZ: this.rutaActiva.snapshot.params.id,
        FECHA_INICIO: this.fechaInicio.toISOString().replace('0Z', ''),
        FECHA_FIN: this.fechaFin.toISOString().replace('9Z', ''),
      };
      this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
      this.filtroEjecucionesForm.reset();
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'RECARGAR EJECUCIONES', JSON.stringify(err));
    }
  }

  consultarDetalle(idProceso, fecha): void {
    try {
      this.area = this.obtenerArea();
      this.ocultarbusqueda = true;
      const format = this.datepipe.transform(fecha, 'yyyy-MM-dd');
      this.paginaActualProceso = 1;
      this.AUDGENEJECUCIONPROCESO$ = this.store.select(
        ({ AUDGENEJECUCIONESPROCESO }) =>
          AUDGENEJECUCIONESPROCESO.AUDGENEJECUCIONESPROCESO
      );
      this.estado = 'FINAL';
      if (
        this.rolesValids(this.DataUser, [this.Administrador]) &&
        this.area === 'SOPORTE'
      ) {
        this.AUDGENPROCESOS$ = this.store
          .select(({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS)
          .pipe(
            map((res) => {
              if (res === null) { return res; }
              else {
                return res.slice().sort(function (a, b) {
                  return (
                    new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()
                  );
                });
              }
            })
          );
      } else if (this.rolesValids(this.DataUser, [this.Administrador])) {
        this.AUDGENPROCESOS$ = this.store
          .select(({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS)
          .pipe(
            map((res) => {
              if (res === null) { return res; }
              else {
                return res
                  .slice()
                  .sort(function (a, b) {
                    return (
                      new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()
                    );
                  })
                  .filter((item) => {
                    return item.MENSAJE_NEGOCIO != '';
                  });
              }
            })
          );
      } else {
        this.AUDGENPROCESOS$ = this.store
          .select(({ AUDGENPROCESOS }) => AUDGENPROCESOS.AUDGENPROCESOS)
          .pipe(
            map((res) => {
              if (res === null) { return res; }
              else {
                return res.slice().sort(function (a, b) {
                  return (
                    new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()
                  );
                });
              }
            })
          );
      }
      const body = {
        ID_PROCESO: idProceso,
      };
      const bodyProcesos = {
        ID_PROCESO: idProceso,
        FECHA: format,
      };
      this.store.dispatch(LoadAUDGENEJECUCIONESPROCESO({ consult: body }));
      this.store.dispatch(LoadAUDGENPROCESOS({ consult: bodyProcesos }));
      this.mostrarEjecucionesProcesos = false;
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'CONSULTAR DETALLE', JSON.stringify(err));
    }
  }

  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  }

  busquedaFiltros(): void {
    try {
      this.paginaActualEjecucionesProceso = 1;
      if (this.filtroEjecucionesForm.valid) {
        let fechaInicialFiltro =
          this.filtroEjecucionesForm.get('fechaFiltrar').value;
        let fechaFinalFiltro = fechaInicialFiltro;
        if (this.filtroEjecucionesForm.get('fechaFiltrar').value != null) {
          const fechaInicialParseada = Date.parse(
            this.filtroEjecucionesForm.get('fechaFiltrar').value
          );
          fechaInicialFiltro = new Date(fechaInicialParseada);
          fechaInicialFiltro.setMinutes(
            fechaInicialFiltro.getMinutes() +
            fechaInicialFiltro.getTimezoneOffset()
          );
          fechaFinalFiltro = new Date(fechaInicialParseada);
          fechaFinalFiltro.setMinutes(
            fechaFinalFiltro.getMinutes() + fechaFinalFiltro.getTimezoneOffset()
          );
          fechaFinalFiltro.setHours(23, 59, 59, 999);
        }
        const idProceso = this.filtroEjecucionesForm.get('idProceso').value;
        this.AUDGENESTADOPROCESOS$ = this.store
          .select(
            ({ AUDGENESTADOPROCESOS }) => AUDGENESTADOPROCESOS.AUDGENESTADOPROCESO
          )
          .pipe(
            map((res) => {
              if (res === null) { return res; }
              else {
                return res
                  .slice()
                  .sort(function (a, b) {
                    return (
                      new Date(b.FECHA_ACTUALIZACION).getTime() -
                      new Date(a.FECHA_ACTUALIZACION).getTime()
                    );
                  })
                  .filter((item, i, res) => {
                    return (
                      res.indexOf(
                        res.find((t) => t.ID_PROCESO === item.ID_PROCESO)
                      ) === i
                    );
                  });
              }
            })
          );
        if (fechaInicialFiltro === null && idProceso === null) {
          this.openModal();
        } else if (fechaInicialFiltro === null && idProceso !== null) {
          const body = {
            ID_PROCESO: idProceso,
          };
          this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
        } else if (fechaInicialFiltro !== null && idProceso === null) {
          const body = {
            INTERFAZ: this.rutaActiva.snapshot.params.id,
            FECHA_INICIO: fechaInicialFiltro.toISOString().replace('0Z', ''),
            FECHA_FIN: fechaFinalFiltro.toISOString().replace('9Z', ''),
          };
          this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
        } else {
          const body = {
            FECHA_INICIO: fechaInicialFiltro.toISOString().replace('0Z', ''),
            FECHA_FIN: fechaFinalFiltro.toISOString().replace('9Z', ''),
            ID_PROCESO: idProceso,
          };
          this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
        }
      }
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'FILTRADO', JSON.stringify(err));
    }
  }

  ejecucionesInexistentesModal(): void {
    this.modalService.open(this.templateRefEjecuciones, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  cerrarModales = () => {
    this.modalService.dismissAll();
  }

  obtenerNotificaciones(fechaInicioSesion): void {
    try {
      if (fechaInicioSesion) {
        const body = {
          filter: { FECHA_ACTUALIZACION: { gt: fechaInicioSesion } },
          limit: 1000,
        };
        this.store.dispatch(LoadAUDGENESTADOPROCESOS({ consult: body }));
      }
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'OBTENER NOTIFICACIONES', JSON.stringify(err));
    }
  }
}
