import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PanelNotificacionesService } from '../../../../../services/panel-notificaciones.service';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/panelNotificaciones/panelnotificaciones.model';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { LogeoService } from '../../../../../services/logeo.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../ReduxStore/app.reducers';
import { EArea } from '../../../../../validators/roles';
import { Usuario } from '../../../../../model/usuario.model';
import { APIService } from '../../../../../API.service';

const cronstrue = require('cronstrue/i18n');
const cronAWS = require('aws-cron-parser');

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  mostrarEjecucionesProcesos = true;
  arrayMinutos = Array.from({ length: 61 }, (v, k) => k)
    .toString()
    .split(',');
  arrayDias1 = [];
  arrayDias2 = [];
  arrayDiasOrginal = [
    {
      label: 'Lunes',
      value: 'MON',
    },
    {
      label: 'Martes',
      value: 'TUE',
    },
    {
      label: 'Miercoles',
      value: 'WED',
    },
    {
      label: 'Jueves',
      value: 'THU',
    },
    {
      label: 'Viernes',
      value: 'FRI',
    },
    {
      label: 'Sabado',
      value: 'SAT',
    },
    {
      label: 'Domingo',
      value: 'SUN',
    },
  ];
  arrayMinutos2 = Array.from({ length: 60 }, (v, k) => k)
    .toString()
    .split(',');
  arrayHoras2 = [];
  arrayHoras1 = [];
  arrayHorasOriginal = Array.from({ length: 24 }, (v, k) => k)
    .toString()
    .split(',');
  elementoEliminar;
  Forms: FormGroup;
  NotificacionesSettings: AUDGENUSUARIO_INTERFACE[] = [];
  NotificacionesSettingTemp: AUDGENUSUARIO_INTERFACE;
  enableArray = [{ value: true }, { value: false }];
  activarMinutos = true;
  activarHorafin = false;
  activarDiafin = false;
  initValuesPanelShow: boolean;
  ayudaArray = [
    {
      title: 'Hora inicio y hora fin',
      input: 'ayudaHora',
      description:
        'Determina el intervalo de horas en las que estará activo el alertamiento. Se configura una hora o puede definirse un rango seleccionando el checkbox para determinar la hora final.',
    },
    {
      title: 'Minutos',
      input: 'ayudaMinutos',
      description:
        'Determina el intervalo de minutos en los que estará activo el alertamiento. Se configura un minuto o puede definirse un rango seleccionando el checkbox para determinar el minuto final.',
    },
    {
      title: 'Dia inicio y dia fin',
      input: 'ayudaDia',
      description:
        'Determina el intervalo de días en las que estará activo el alertamiento. Se configura un día o puede definirse un rango seleccionando el checkbox para determinar el día final.',
    },
  ];
  ayudaSelect = {
    title: '',
    input: '',
    description: '',
  };
  DataUser: Usuario;
  ArrayPermisos = [];

  /* temporalData */
  temporalDatos;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private PanelNotificacionesService: PanelNotificacionesService,
    private logeo: LogeoService,
    private store: Store<AppState>,
    private api: APIService
  ) {}

  ngOnInit(): void {
    try {
      let cron;
      let cronFlag;
      let occurrence;
      const cronExpression = '59 4 ? * TUE-SAT *';
      const cronString = cronstrue.toString(cronExpression, {
        verbose: true,
        locale: 'es',
      });
      /* Si existe el chequeo del cron*/
      if (cronAWS.parse(cronExpression)) {
        try {
          cron = cronAWS.parse(cronExpression);
          occurrence = cronAWS.next(cron, new Date());
          cronFlag = 'valido';
        } catch (e) {
          cronFlag = 'invalido';
        }
      } else {
        cronFlag = 'invalido';
      }
      this.getPermisosDeEdicionManipulacion();
    } catch (err) {
      this.logeo.registrarLog(
        'NOTIFICACIONES',
        'CARGAR PANTALLA',
        JSON.stringify(err)
      );
    }
  }

  getPermisosDeEdicionManipulacion = () => {
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
          const negocio = this.DataUser.attributes['custom:negocio']
            .toUpperCase()
            .split(',');
          const rol = this.DataUser.attributes['custom:rol'].toUpperCase();
          this.api
            .ListCATPERMISOS(negocio, area, rol)
            .then(({ items }: any) => {
              this.ArrayPermisos = items;

              this.initValuesPanel();
            });
        }
      });
  };

  abrirToass = () => {
    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><img class="successRegistro"/>';
    mensaje = mensaje + 'Registro';
    mensaje = mensaje + ' actualizado ';
    mensaje = mensaje + '</div>';
    this.toastr.show(mensaje, null, {
      timeOut: 1500,
      toastClass:
        'etiquetaAddRegistro etiquetaAddRegistro row justify-content-center',
      positionClass: 'toast-top-right',
      enableHtml: true,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  };

  changeEvent = ({ target }) => {
    switch (target.id) {
      case 'minutosCheck':
        this.eliminarMinutos2();
        break;
      case 'arrayDias1':
        this.arrayDias2 = this.arrayDiasOrginal.filter(
          (e) => e.value !== this.Forms.get('arrayDias1').value
        );
        break;
      case 'arrayHoras1':
        this.arrayHoras2 = this.arrayHorasOriginal.filter(
          (e) => e !== this.Forms.get('arrayHoras1').value
        );
        break;
      case 'horafinCheck':
        this.crearHoraFin();
        break;
      case 'diafinCheck':
        this.crearDiaFin();
        break;
    }
  };

  siONo = (value) => {
    return value ? 'Si' : 'No';
  };

  costruirCron = () => {
    let contruido = '';
    if (!this.activarMinutos) {
      contruido = contruido + this.Forms.get('minutos2').value + ' ';
    } else {
      contruido = contruido + '0/' + this.Forms.get('minutos').value + ' ';
    }
    if (!this.activarHorafin) {
      contruido =
        contruido +
        this.tranformsHourUtc(this.Forms.get('arrayHoras1').value) +
        ' ? * ';
    } else {
      contruido =
        contruido +
        this.tranformsHourUtc(this.Forms.get('arrayHoras1').value) +
        '-' +
        this.tranformsHourUtc(this.Forms.get('arrayHoras2').value) +
        ' ? * ';
    }
    if (!this.activarDiafin) {
      contruido = contruido + this.Forms.get('arrayDias1').value + ' *';
    } else {
      contruido =
        contruido +
        this.Forms.get('arrayDias1').value +
        '-' +
        this.Forms.get('arrayDias2').value +
        ' *';
    }
    this.Forms.get('schedule').setValue(contruido);
  };

  eliminarMinutos2 = () => {
    //minutos: new FormControl('No aplica', [Validators.required]),
    if (this.Forms.get('minutosCheck').value === true) {
      this.activarMinutos = true;
      this.Forms.addControl(
        'minutos',
        new FormControl(0, [Validators.required])
      );
      this.Forms.removeControl('minutos2');
    } else {
      this.Forms.addControl(
        'minutos2',
        new FormControl(0, [Validators.required])
      );
      this.Forms.removeControl('minutos');
      this.activarMinutos = false;
    }
  };

  crearHoraFin = () => {
    if (this.Forms.get('horafinCheck').value === true) {
      this.activarHorafin = true;
      this.Forms.addControl(
        'arrayHoras2',
        new FormControl(0, [Validators.required])
      );
    } else {
      this.Forms.removeControl('arrayHoras2');
      this.activarHorafin = false;
    }
  };

  crearDiaFin = () => {
    if (this.Forms.get('diafinCheck').value === true) {
      this.activarDiafin = true;
      this.Forms.addControl(
        'arrayDias2',
        new FormControl(null, [Validators.required])
      );
    } else {
      this.Forms.removeControl('arrayDias2');
      this.activarDiafin = false;
    }
  };

  tranformsHourUtc = (valueParam) => {
    let stringDate = moment().format('YYYY-MM-DD').toString() + ' ';
    if (valueParam > 9) {
      stringDate = stringDate + valueParam + ':00';
    } else {
      stringDate = stringDate + '0' + valueParam + ':00';
    }
    let utcTransforms = moment(stringDate).utc().toISOString();
    let hora = utcTransforms.split('T')[1].split(':')[0];
    let arrayHora = hora.split('');
    if (arrayHora[0] === '0') {
      return arrayHora[1];
    } else {
      return hora;
    }
  };

  initValuesPanel = (edit = false) => {
    this.spinner.show();
    this.PanelNotificacionesService.getListadoNotificacionesSettings()
      .then(
        (res: any) => {
          this.NotificacionesSettings = res;
          //*transformo a un  array nuevo que me permita hacer validaciones */
          this.NotificacionesSettings = this.NotificacionesSettings.map(
            (elementoNotificacion) => {
              const attributosParaValidacion = this.ArrayPermisos.filter(
                (elementoFiltrar) =>
                  elementoFiltrar.FLUJO === elementoNotificacion.interfaz
              );
              /* validar si hay algo hay aun que validar que se haga nuevo arreglo */
              if (attributosParaValidacion.length > 0) {
                elementoNotificacion.ACTUALIZAR =
                  attributosParaValidacion[0].CATALOGOS.ACTUALIZAR;
                elementoNotificacion.CONSULTAR =
                  attributosParaValidacion[0].CATALOGOS.CONSULTAR;
                return {
                  ...elementoNotificacion,
                };
              } else {
                elementoNotificacion.CONSULTAR = false;
                return {
                  ...elementoNotificacion,
                };
              }
            }
          );

          //aqui una ves tranformado el array puedo filtrar los que se van a consultar;
          this.NotificacionesSettings = this.NotificacionesSettings.filter(
            (e) => e.CONSULTAR === true
          );

          this.spinner.hide();
          if (edit) {
            this.abrirToass();
          }
        },
        () => {
          this.spinner.hide();
        }
      )
      .catch(() => {
        this.spinner.hide();
      });
    this.arrayDias1 = this.arrayDiasOrginal.filter((e) => e.value !== 'NA');
    this.arrayDias2 = this.arrayDiasOrginal.filter((e) => e.value !== 'MON');
    this.arrayHoras2 = this.arrayHorasOriginal.filter((e) => e !== '0');
    this.arrayHoras1 = this.arrayHorasOriginal.filter((e) => e !== 'No aplica');
    this.Forms = new FormGroup({
      schedule: new FormControl('', [Validators.required]),
      minutos: new FormControl('No aplica', [Validators.required]),
      minutos2: new FormControl(0, [Validators.required]),
      arrayHoras2: new FormControl('No aplica', [Validators.required]),
      arrayHoras1: new FormControl('0', [Validators.required]),
      arrayDias1: new FormControl('MON', [Validators.required]),
      arrayDias2: new FormControl('NA', [Validators.required]),
      enabled: new FormControl(false, [Validators.required]),
    });
  };

  updateRegister = () => {
    try {
      this.costruirCron();
      let { schedule, enabled, description } = this.Forms.value;
      let body = { schedule, enabled, description };
      /*saber si va ver minutos */

      if (this.Forms.value?.minutosCheck) {
        if (this.Forms.get('minutos').value === 'No aplica') {
          body['seconds'] = this.Forms.get('seconds');
        } else {
          body['seconds'] = parseInt(this.Forms.get('minutos').value) * 60;
        }
      }
      /* ponemos la misma estructura que quiere el back para que no tenga problemas */
      this.temporalDatos.cron = schedule;
      this.temporalDatos.estatus = enabled === 'false' ? false : true;
      this.PanelNotificacionesService.updateNotificacionSettings(
        this.NotificacionesSettingTemp.id,
        this.temporalDatos
      ).then(() => {
        this.mostrarEjecucionesProcesos = true;
        this.initValuesPanel(true);
      });
    } catch (err) {
      this.logeo.registrarLog(
        'NOTIFICACIONES',
        'ACTUALIZAR',
        JSON.stringify(err)
      );
    }
  };

  mostrarCardEditarResgistro = (
    NotificacionesSetting: AUDGENUSUARIO_INTERFACE
  ) => {
    /*ponemos la variables que nos dara la estructura para actualizar */
    this.temporalDatos = NotificacionesSetting;

    this.initValuesPanelShow = true;
    this.NotificacionesSettingTemp = NotificacionesSetting;
    this.mostrarEjecucionesProcesos = false;
    this.Forms = null;
    this.Forms = new FormGroup({
      schedule: new FormControl(NotificacionesSetting.cron, [
        Validators.required,
      ]),
      enabled: new FormControl(NotificacionesSetting.estatus, [
        Validators.required,
      ]),
      arrayHoras1: new FormControl(0, [Validators.required]),
      horafinCheck: new FormControl(false, []),
      arrayDias1: new FormControl('MON', [Validators.required]),
      diafinCheck: new FormControl(false, []),
      minutosCheck: new FormControl(false, []),
    });
    let arraySchedule = NotificacionesSetting.cron.split(' ');
    let arrayMinuto = arraySchedule[0].split('/');
    if (arrayMinuto.length > 1) {
      this.Forms.get('minutosCheck').setValue(true);
      this.changeEvent({ target: { id: 'minutosCheck' } });
      this.Forms.get('minutos').setValue(arrayMinuto[1]);
    } else {
      this.Forms.get('minutosCheck').setValue(false);
      this.changeEvent({ target: { id: 'minutosCheck' } });
      this.Forms.get('minutos2').setValue(arrayMinuto[0]);
    }
    let arrayHorasSchedule = arraySchedule[1].split('-');
    let dateS = moment().utc().toISOString().split('T')[0];
    if (arrayHorasSchedule[0].length > 1) {
      dateS = dateS + 'T' + arrayHorasSchedule[0] + ':00:00.000Z';
    } else {
      dateS = dateS + 'T0' + arrayHorasSchedule[0] + ':00:00.000Z';
    }
    this.Forms.get('arrayHoras1').setValue(new Date(dateS).getHours());
    this.changeEvent({ target: { id: 'arrayHoras1' } });
    if (arrayHorasSchedule.length > 1) {
      let dateS = moment().utc().toISOString().split('T')[0];
      if (arrayHorasSchedule[1].length > 1) {
        dateS = dateS + 'T' + arrayHorasSchedule[1] + ':00:00.000Z';
      } else {
        dateS = dateS + 'T0' + arrayHorasSchedule[1] + ':00:00.000Z';
      }
      this.Forms.get('horafinCheck').setValue(true);
      this.changeEvent({ target: { id: 'horafinCheck' } });
      this.Forms.get('arrayHoras2').setValue(new Date(dateS).getHours());
    } else {
      this.Forms.get('horafinCheck').setValue(false);
      this.changeEvent({ target: { id: 'horafinCheck' } });
    }
    let arrayDiasSchedule = [];
    if (arraySchedule[4] === '*' || arraySchedule[4] === '?') {
      arrayDiasSchedule = ['MON', 'SUN'];
    } else {
      arrayDiasSchedule = arraySchedule[4].split('-');
    }
    this.Forms.get('arrayDias1').setValue(arrayDiasSchedule[0]);
    this.changeEvent({ target: { id: 'arrayDias1' } });
    if (arrayDiasSchedule.length > 1) {
      this.Forms.get('diafinCheck').setValue(true);
      this.changeEvent({ target: { id: 'diafinCheck' } });
      this.Forms.get('arrayDias2').setValue(arrayDiasSchedule[1]);
    } else {
      this.Forms.get('diafinCheck').setValue(false);
      this.changeEvent({ target: { id: 'diafinCheck' } });
    }
    if (NotificacionesSetting?.seconds) {
      this.Forms.addControl(
        'seconds',
        new FormControl(NotificacionesSetting.seconds, [])
      );
    }
  };

  ocultarCardAgregarResgistro = () => {
    this.mostrarEjecucionesProcesos = true;
    this.initValuesPanelShow = false;
    this.Forms.reset();
  };

  helperInputs = (input) => {
    this.ayudaSelect = this.ayudaArray.filter((e) => e.input === input)[0];
  };

  openModalConfirmacionEliminar(content, object) {
    this.elementoEliminar = object;

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'confirmacionUsuariosModal',
    });
  }
}
