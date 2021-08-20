import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { Observable, of, Subscription } from 'rxjs';
import { AUDGENPROCESO_INERFACE } from '../../../../../model/AUDGENPROCESO.model';
import { CATPROCESOS_INTERFACE } from '../../../../../model/CATPROCESOS.model';
import { APIService } from '../../../../../API.service';
import { AuthService } from 'src/app/services/auth.service';
import { AUDGENESTADOPROCESO_INTERFACE } from 'src/app/model/AUDGENESTADOPROCESO.model';
import { CATPERMISOS_INTERFACE } from 'src/app/model/CATPERMISOS.model';
import { LoadCATPROCESOS, UnsetCATPROCESO, LoadCATPERMISOS, UnsetCATPERMISO, LoadAUDGENESTADOPROCESOS } from 'src/app/ReduxStore/actions';
import { Usuario } from '../../../../../model/usuario.model';
import { ProcesosService } from '../../../../../services/procesos.service';
import { v4 as uuidv4 } from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
import { EArea, ERole } from './../../../../../validators/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogeoService } from '../../../../../services/logeo.service';

@Component({
  selector: 'app-procesos-pantalla-general',
  templateUrl: './procesos-pantalla-general.component.html',
  styleUrls: ['./procesos-pantalla-general.component.css'],
})

export class ProcesosPantallaGeneralComponent implements OnInit, OnDestroy {

  @ViewChild('modalEstado') templateRef: TemplateRef<any>;

  Areas = [
    EArea.Contabilidad,
    EArea.Custodia,
    EArea.Inversiones_Riesgos,
    EArea.Tesoreria,
    EArea.Soporte
  ];
  public createForm: FormGroup;
  inputFecha = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  Loading$: Subscription;
  DataUser$: Observable<Usuario>;
  LoadingPermisos$: Subscription;
  AUDGENPROCESOS$: Observable<AUDGENPROCESO_INERFACE[]>;
  CATPROCESOS$: Observable<CATPROCESOS_INTERFACE[]>;
  AUDGENESTADOPROCESOS$: Observable<AUDGENESTADOPROCESO_INTERFACE[]>;
  CATPERMISOS$: Observable<CATPERMISOS_INTERFACE[]>;
  CATPROCESOS: CATPROCESOS_INTERFACE[];
  CATPERMISOS: CATPERMISOS_INTERFACE[];
  CATESTADOS: AUDGENESTADOPROCESO_INTERFACE[];
  PROCESOS$: Observable<any>;
  procesoEjecutar: string;
  mensajeEjecucion: string;
  actualPage = 1;
  negocios = [];
  area: string;
  tipo: String;
  loading = true;
  Administrador = ERole.Administrador;
  Ejecutor = ERole.Monitor;
  DataUser: Usuario;
  PROCESOS = new Array();

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private rutaActiva: ActivatedRoute,
    private api: APIService,
    private serviciosProcesos: ProcesosService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private modalService: NgbModal,
    private logeo: LogeoService
  ) {
    this.Loading$ = this.store.select(
      ({ CATPERMISOS }) => CATPERMISOS.error
    ).subscribe((res => {
    }));
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.rutaActiva.paramMap.subscribe(params => {
      this.ngOnInit();
    });
  }

  /* Función que se ejecuta para limpiar memoria al salir de la pantalla */
  ngOnDestroy(): void {
    this.store.dispatch(UnsetCATPROCESO());
  }

  /* Función que se ejecuta al cargar la pantalla */
  ngOnInit(): void {
    try {
      this.authService.refreshToken();
      this.actualPage = 1;
      this.DataUser$ = this.store.select(({ usuario }) => usuario.user);
      this.store.select(({ usuario }) => usuario.user).subscribe(res => { this.DataUser = res; });
      this.area = this.obtenerArea();
      this.tipo = this.rutaActiva.snapshot.params.tipo;
      this.negocios = this.DataUser.attributes['custom:negocio'].split(',');
      this.negocios = this.negocios.map(negocio => negocio.toUpperCase());
      const bodyProcesos = {
        filter: { TIPO: { eq: this.tipo.toUpperCase() } },
        limit: 1000
      };
      const bodyPermisos = {
        NEGOCIOS: this.negocios, AREA: this.area, ROL: this.DataUser.attributes['custom:rol'].toUpperCase()
      };
      this.CATPERMISOS$ = this.store.select(
        ({ CATPERMISOS }) => CATPERMISOS.CATPERMISOS
      );
      this.store.dispatch(LoadCATPROCESOS({ consult: bodyProcesos }));
      this.CATPROCESOS$ = this.store.select(
        ({ CATPROCESOS }) => CATPROCESOS.CATPROCESOS
      );
      this.store.dispatch(LoadCATPERMISOS({ consult: bodyPermisos }));
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'CARGAR PANTALLA', JSON.stringify(err));
    }
  }

  /* Función para obtener los procesos que puede ejecutar el usuario a partir de sus permisos */
  obtenerProcesos(catProcesos: Array<CATPROCESOS_INTERFACE>, catPermisos: Array<CATPERMISOS_INTERFACE>): boolean {
    try {
      const tempArray = new Array();
      catProcesos.forEach(proceso => {
        catPermisos.forEach(permiso => {
          if (permiso.FLUJO === proceso.PROCESO) {
            tempArray.push({
              DESCRIPCION: proceso.DESCRIPCION,
              PROCESO: proceso.PROCESO,
              DETENER: permiso.PROCESOS.DETENER,
              INICIAR: permiso.PROCESOS.INICIAR,
              MONITOREAR: permiso.PROCESOS.MONITOREAR
            });
          }
        }
        );
      }
      );
      this.PROCESOS = tempArray;
      return true;
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'OBTENER PROCESOS', JSON.stringify(err));
    }
  }

  /* Función para obtener el area a la que pertenece el usuario y asi ejecutar la consulta de permisos */
  obtenerArea(): string {
    try {
      const arrayTempArea = [];
      this.DataUser.groups.forEach((area) => {
        this.Areas.forEach(areaDef => {
          if (area === areaDef) {
            arrayTempArea.push(area);
          }
        });
      });
      if (arrayTempArea.length > 0) {
        return arrayTempArea[0].toUpperCase();
      }
      else { 'N/D'; }
    } catch (err) {
      this.logeo.registrarLog('PROCESOS', 'OBTENER AREA', JSON.stringify(err));
    }
  }

  /* Función para asignar el tipo de proceso (Diurno o Nocturno) */
  setTipo(tipo: string): void {
    localStorage.setItem('tipoProceso', tipo);
  }

  /* Función para activar el boton del tipo de proceso que se esta consultando (diurno o nocturno) */
  botonActivado = (parametocomparar: string): boolean => {
    return this.rutaActiva.snapshot.params.tipo === parametocomparar
      ? true
      : false;
  }

  /* Funcion para actualizar el componente por medio de la navegacion */
  refreshComponent(): void {
    this.router.navigate([this.router.url]);
  }

  /* Funcion para consultar el nombre descriptivo del proceo a partir del identificador y asignarlo en la ruta de navegacion */
  consultar(idProceso, titulo): void {
    this.guardarDescripcionProceso(titulo);
    this.router.navigate(['/' + window.location.pathname + '/' + idProceso]);
  }

  /* Funcion para abrir el modal para ejecutar el proceso */
  openModal(content, nombreProceso, descripcionProceso): void {
    const proceso = {
      sigla: nombreProceso,
      nombre: descripcionProceso
    };
    localStorage.setItem('proceso', JSON.stringify(proceso));
    this.procesoEjecutar = nombreProceso;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  /* Funcion para abrir el mensaje de la ejecucion del proceso */
  modalMensaje(content, mensajeEjecucion): void {
    this.mensajeEjecucion = mensajeEjecucion;
    this.modalService.open(this.templateRef, { ariaLabelledBy: 'modal-basic-title' });
  }

  /* Funcion que manda a iniciar el proceso seleccionado */
  async inciarProceso(correo: string, area: string) {
    let CATESTADOS;
    const todayDate = new Date();
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    this.authService.refreshToken();
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);
    this.spinner.show();
    const body = {
      INTERFAZ: this.procesoEjecutar,
    };
    // tslint:disable-next-line: max-line-length
    /* Consulta del estado del proceso para saber si se puede mandar una nueva ejecucion */

    await this.api.ListSiaGenAudEstadoProcesosDevs(body.INTERFAZ, fechaInicio.toISOString().replace('0Z', ''), fechaFin.toISOString().replace('9Z', '')).then(res => {
      // tslint:disable-next-line: max-line-length

      this.CATESTADOS = res.items.slice().sort(function (a, b) { return new Date(b.FECHA_ACTUALIZACION).getTime() - new Date(a.FECHA_ACTUALIZACION).getTime(); });
      console.log(res);

    });

    /* Validacion del estado para mandar una nueva ejecucion */
    if (this.CATESTADOS[0]?.ESTADO_EJECUCION === 'TERMINADO' || this.CATESTADOS.length === 0) {
      const idEjecucion = uuidv4();
      this.authService.refreshToken();
      try {
        /* Solicitud para iniciar el nuevo proceso */
        const response = await this.serviciosProcesos.iniciarProceso(this.procesoEjecutar, correo, area);
        if (response.codigo == 'EXITO') {
          /* Generar mensaje de respuesta exitosa a la solicitud */
          this.spinner.hide();
          this.modalMensaje('modalEstado', 'Se inicio el proceso');
          this.serviciosProcesos.generarAuditoria('EXITO', 'Se inició el proceso', response.idProceso);
        } else if (response.descripcion.includes('401')) {
          /* Refrescar token del usaurio si la respuesta fue un 401 */
          this.spinner.hide();
          this.modalService.dismissAll();
          this.authService.refreshToken();
        }
        else {
          /* Generar mensaje con las descripcion del fallo en caso que la solicitud no fuera exitosa */
          this.spinner.hide();
          this.modalMensaje('modalEstado', 'Error al ejecutar proceso: ' + response.descripcion);
          this.serviciosProcesos.generarAuditoria('FALLO', response.descripcion, null);
        }
      } catch (e) {
        /* Generar mensaje con las descripcion del fallo en caso que la solicitud no fuera exitosa */
        this.modalMensaje('modalEstado', 'No se pudo ejecutar el procesos: ' + e.message);
        this.serviciosProcesos.generarAuditoria('FALLO', e.message, null);
      }
    } else if (this.CATESTADOS[0]?.ESTADO_EJECUCION === 'INICIADO') {
      /* Generar mensaje si el procesos ya se encuentra en ejecucion */
      this.modalMensaje('modalEstado', 'El proceso se encuentra en ejecución');
      this.serviciosProcesos.generarAuditoria('FALLO', 'El proceso se encontraba en ejecución', null);
    } else {
      /* Generar mensaje para identificar que la consulta de estado no tiene datos para el proceso consultado */
      this.modalMensaje('modalEstado', 'Error al ejecutar proceso. No se tienen datos del estado actual del proceso.');
    }
    setTimeout(() => {
      this.spinner.hide();
    }, 300);
  }

  /* Función para guardar en memoria el nombre descriptivo del proceso */
  guardarDescripcionProceso(descripcion: string) {
    localStorage.setItem(
      'Titulo',
      JSON.stringify(descripcion)
    );
  }

  /* Funcion que manda a validar los permisos del usuario en el servicio de autenticacion */
  rolesValids = (User: Usuario, roles: any[]): boolean => {
    return this.authService.rolesValids(User, roles);
  }

  /* Funcion para cerrar todos los modales de la pantalla */
  cerrarModales = () => {
    this.modalService.dismissAll();
  }

}
