import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PanelNotificacionesService } from '../../../../../services/panel-notificaciones.service';
import { AUDGENUSUARIO_INTERFACE } from '../../../../../model/panelNotificaciones/panelnotificaciones.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  mostrarEjecucionesProcesos = true;

  elementoEliminar;

  Forms: FormGroup;

  NotificacionesSettings: AUDGENUSUARIO_INTERFACE[] = [];

  NotificacionesSettingTemp: AUDGENUSUARIO_INTERFACE;

  validateSeconds = false;

  enableArray = [{ value: true }, { value: false }];

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

    this.Forms = new FormGroup({
      schedule: new FormControl('', [Validators.required]),
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
