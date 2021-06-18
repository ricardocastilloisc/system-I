import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PanelNotificacionesService } from '../../../../../services/panel-notificaciones.service';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/panelNotificaciones/panelnotificaciones.model';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

const cronstrue = require('cronstrue/i18n');
const cronAWS = require('aws-cron-parser');

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  mostrarEjecucionesProcesos = true;

  arrayMinutos = (
    'No aplica,' + Array.from({ length: 61 }, (v, k) => k).toString()
  ).split(',');

  arrayDias1 = [];
  arrayDias2 = [];

  arrayDiasOrginal = [
    {
      label: 'No aplica',
      value: 'NA',
    },
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

  arrayHorasOriginal = (
    'No aplica,' + Array.from({ length: 24 }, (v, k) => k).toString()
  ).split(',');

  elementoEliminar;

  Forms: FormGroup;

  NotificacionesSettings: AUDGENUSUARIO_INTERFACE[] = [];

  NotificacionesSettingTemp: AUDGENUSUARIO_INTERFACE;

  enableArray = [{ value: true }, { value: false }];

  activarMinutos = true;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private PanelNotificacionesService: PanelNotificacionesService
  ) {}

  ngOnInit(): void {
    let cron;
    let cronFlag;
    let occurrence;
    const cronExpression = '59 4 ? * TUE-SAT *';
    const cronString = cronstrue.toString(cronExpression, {
      verbose: true,
      locale: 'es',
    });
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
    console.log(
      cronString,
      ' es ',
      cronFlag,
      '. La siguiente ejecucion es ',
      occurrence
    );

    this.initValuesPanel();
  }

  abrirToass = () => {
    let mensaje =
      '<div class="row justify-content-center align-items-center textoAddUpdateregistro"><img class="successRegistro"/>';

    //mensaje = mensaje + 'Registro' 'exitoso';
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
      case 'minutos':
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
    }
  };

  siONo = (value) => {
    return value ? 'Si' : 'No';
  };

  costruirCron = () => {
    let contruido = '';

    if (this.Forms.get('minutos').value === 'No aplica') {
      contruido = contruido + this.Forms.get('minutos2').value + ' ';
    } else {
      contruido = contruido + '0/' + this.Forms.get('minutos').value + ' ';
    }

    if (this.Forms.get('arrayHoras2').value === 'No aplica') {
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

    if (this.Forms.get('arrayDias2').value === 'NA') {
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
    if (this.Forms.get('minutos').value === 'No aplica') {
      this.activarMinutos = true;
      this.Forms.addControl(
        'minutos2',
        new FormControl(0, [Validators.required])
      );
    } else {
      this.Forms.removeControl('minutos2');
      this.activarMinutos = false;
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
      description: new FormControl('', [Validators.required]),
    });
  };

  updateRegister = () => {
    this.costruirCron();

    let { schedule, enabled, description } = this.Forms.value;

    let body = { schedule, enabled, description };

    if (this.Forms.value?.seconds) {
      if (this.Forms.get('minutos').value === 'No aplica') {
        body['seconds'] = this.Forms.get('seconds');
      } else {
        body['seconds'] = parseInt(this.Forms.get('minutos').value) * 60;
      }
    }

    this.PanelNotificacionesService.updateNotificacionSettings(
      this.NotificacionesSettingTemp.id,
      body
    ).then(() => {
      this.mostrarEjecucionesProcesos = true;
      this.initValuesPanel(true);
    });

  };

  mostrarCardEditarResgistro = (
    NotificacionesSetting: AUDGENUSUARIO_INTERFACE
  ) => {
    this.NotificacionesSettingTemp = NotificacionesSetting;
    this.mostrarEjecucionesProcesos = false;

    this.Forms = null;
    this.Forms = new FormGroup({
      schedule: new FormControl(NotificacionesSetting.schedule, [
        Validators.required,
      ]),
      enabled: new FormControl(NotificacionesSetting.enabled, [
        Validators.required,
      ]),
      description: new FormControl(NotificacionesSetting.description, [
        Validators.required,
      ]),
      minutos: new FormControl('No aplica', [Validators.required]),
      arrayHoras2: new FormControl('No aplica', [Validators.required]),
      arrayHoras1: new FormControl(0, [Validators.required]),
      arrayDias1: new FormControl('MON', [Validators.required]),
      arrayDias2: new FormControl('NA', [Validators.required]),
    });

    let arraySchedule = NotificacionesSetting.schedule.split(' ');

    let arrayMinuto = arraySchedule[0].split('/');

    if (arrayMinuto.length > 1) {
      this.activarMinutos = false;
      this.Forms.get('minutos').setValue(arrayMinuto[1]);
    } else {
      this.activarMinutos = true;
      this.Forms.addControl(
        'minutos2',
        new FormControl(arrayMinuto[0], [Validators.required])
      );
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

      this.Forms.get('arrayHoras2').setValue(new Date(dateS).getHours());
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
      this.Forms.get('arrayDias2').setValue(arrayDiasSchedule[1]);
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
    this.Forms.reset();
  };

  openModalConfirmacionEliminar(content, object) {
    this.elementoEliminar = object;

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'confirmacionUsuariosModal',
    });
  }
}
