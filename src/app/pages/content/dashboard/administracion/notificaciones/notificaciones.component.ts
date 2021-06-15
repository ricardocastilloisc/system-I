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
    this.spinner.show();

    this.PanelNotificacionesService.getListadoNotificacionesSettings()
      .then((res: any) => {
        this.NotificacionesSettings = res;

        console.log(this.NotificacionesSettings);
        this.spinner.hide();
      }, ()=>{

        this.spinner.hide();
      })
      .catch(() => {
        this.spinner.hide();
      });

    this.Forms = new FormGroup({
      schedule: new FormControl('', [Validators.required]),
      seconds: new FormControl('', [Validators.required]),
      enabled: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  mostrarCardEditarResgistro = (NotificacionesSetting) => {
    this.mostrarEjecucionesProcesos = false;
    this.Forms = null;
    this.Forms = new FormGroup({
      schedule: new FormControl(NotificacionesSetting.schedule, [
        Validators.required,
      ]),
      seconds: new FormControl(NotificacionesSetting.seconds, [
        Validators.required,
      ]),
      enabled: new FormControl(NotificacionesSetting.enabled, [
        Validators.required,
      ]),
      name: new FormControl(NotificacionesSetting.name, [
        Validators.required,
      ]),
    });
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
