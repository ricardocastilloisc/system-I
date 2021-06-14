import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  mostrarEjecucionesProcesos = true;

  elementoEliminar;

  Forms: FormGroup;

  NotificacionesSettings = [
    {
      id: '143-43-4-23-34-3',
      schedule: '* * * *',
      seconds: 100,
      activated: true,
      descripcion: 'LA ALRMA DE RICARDO xd',
    },
  ];

  /*[{"id": "143-43-4-23-34-3","schedule":"* * * *","seconds":100,activated:true,"descripcion":"LA ALRMA DE RICARDO xd"}]*/

  constructor(private toastr: ToastrService, private modalService: NgbModal) {}

  ngOnInit(): void {

    this.Forms = new FormGroup({
      schedule: new FormControl('',[Validators.required]),
      seconds: new FormControl('',[Validators.required]),
      activated: new FormControl('',[Validators.required]),
      descripcion: new FormControl('',[Validators.required]),
    });


  }

  mostrarCardEditarResgistro = (NotificacionesSetting) => {
    this.mostrarEjecucionesProcesos = false;
    this.Forms = null;
    this.Forms = new FormGroup({
      schedule: new FormControl(NotificacionesSetting.schedule,[Validators.required]),
      seconds: new FormControl(NotificacionesSetting.seconds,[Validators.required]),
      activated: new FormControl(NotificacionesSetting.activated,[Validators.required]),
      descripcion: new FormControl(NotificacionesSetting.descripcion,[Validators.required]),
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
