import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PanelNotificacionesService } from '../../../../../services/panel-notificaciones.service';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/panelNotificaciones/panelnotificaciones.model';
import { NgxSpinnerService } from 'ngx-spinner';
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
    'No aplica,' + Array.from({ length: 59 }, (v, k) => k).toString()
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
      value: 'Fri',
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

  arrayMinutos2 = Array.from({ length: 59 }, (v, k) => k)
    .toString()
    .split(',');

  arrayHoras2 = []

  arrayHoras1 = []


    arrayHorasOriginal = (
      'No aplica,' + Array.from({ length: 23 }, (v, k) => k).toString()
    ).split(',');

  elementoEliminar;

  Forms: FormGroup;

  NotificacionesSettings: AUDGENUSUARIO_INTERFACE[] = [];

  NotificacionesSettingTemp: AUDGENUSUARIO_INTERFACE;

  validateSeconds = false;

  enableArray = [{ value: true }, { value: false }];

  activarMinutos = true;

  cronConstruido = '';

  /*

  PanelNotificacionesService
  [{"id": "143-43-4-23-34-3","schedule":"* * * *","seconds":100,activated:true,"name":"LA ALRMA DE RICARDO xd"}]*/

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
        this.arrayHoras2 = this.arrayHorasOriginal.filter(e => e !== this.Forms.get('arrayHoras1').value)
        break;
    }
  };

  costruirCron = () => {
    let contruido = '';

    if (this.Forms.get('minutos').value === 'No aplica') {
      contruido = contruido + this.Forms.get('minutos2').value + ' ';
    } else {
      contruido = contruido + '0/' + this.Forms.get('minutos').value + ' ';
    }

    if (this.Forms.get('arrayHoras2').value === 'No aplica') {
      contruido = contruido + this.Forms.get('arrayHoras1').value + ' ? * ';
    } else {
      contruido =
        contruido +
        this.Forms.get('arrayHoras1').value +
        '-' +
        this.Forms.get('arrayHoras2').value +
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
    this.cronConstruido = contruido
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

  initValuesPanel = (edit = false) => {
    this.spinner.show();
    this.validateSeconds = false;
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


    this.arrayHoras2 = this.arrayHorasOriginal.filter(e => e !== '0')
    this.arrayHoras1 = this.arrayHorasOriginal.filter(e => e !== 'No aplica')



    this.Forms = new FormGroup({
      schedule: new FormControl('', [Validators.required]),
      minutos: new FormControl('No aplica', [Validators.required]),
      minutos2: new FormControl(0, [Validators.required]),
      arrayHoras2: new FormControl('No aplica', [Validators.required]),
      arrayHoras1: new FormControl('0', [Validators.required]),
      arrayDias1: new FormControl('MON', [Validators.required]),
      arrayDias2: new FormControl('NA', [Validators.required]),
      enabled: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  };

  updateRegister = () => {
    this.PanelNotificacionesService.updateNotificacionSettings(
      this.NotificacionesSettingTemp.id,
      this.Forms.value
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
    this.validateSeconds = false;
    this.Forms = null;
    this.Forms = new FormGroup({
      schedule: new FormControl(NotificacionesSetting.schedule, [
        Validators.required,
      ]),
      enabled: new FormControl(NotificacionesSetting.enabled, [
        Validators.required,
      ]),
      name: new FormControl(NotificacionesSetting.name, [Validators.required]),

      minutos: new FormControl('No aplica', [Validators.required]),
      minutos2: new FormControl(0, [Validators.required]),
      arrayHoras2: new FormControl('No aplica', [Validators.required]),
      arrayHoras1: new FormControl(0, [Validators.required]),
      arrayDias1: new FormControl('MON', [Validators.required]),
      arrayDias2: new FormControl('NA', [Validators.required]),
    });

    if (NotificacionesSetting?.seconds) {
      this.Forms.addControl(
        'seconds',
        new FormControl(NotificacionesSetting.seconds, [Validators.required])
      );
      this.validateSeconds = true;
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
