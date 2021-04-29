import { Injectable } from '@angular/core';
import Amplify from 'aws-amplify';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';

Amplify.configure(environment.amplifyConfig);
var sqs = new AWS.SQS();

var payload = { /* este objeto se llenara por cada pantalla/proceso que se lanza */ 
  areaNegocio: "TESORERÍA",
  rol: "REVIEW-2",
  correo: "garcia.pablo@principal.com",
  fecha: "2021-03-22T20:32:43.838-06:00",
  usuario: {
    apellidoPaterno: "GARCIA",
    apellidoMaterno: "Rosas",
    correo: "bernal.pablo@principal.com",
    inicioSesion: "2021-03-22T20:32:43.838-06:00",
    finSesion: "2021-03-22T20:32:43.838-06:00"
  },
  seccion: {
    nombre: "ARCHIVOS",
    subseccion: "PROCESOS",
    accion: "BUSQUEDA DE ARCHIVOS POR FECHA"
  },
  catalogos: {
    nombre: "MD",
    accion: "MODIFICAR",
    descripcion: "MODIFICACIÓN SATISFACTORIA DEL CATÁLOGO PARA LA INTERFAZ DE MD",
    estado: "EXITOSA",
    detalleModificaciones: [{
      campo: "valor",
      valorAnterior: "Valor_MO_1",
      valorNuevo: "Valor_MO_2"
    }]
  },
  procesos: {
    tipo: "DIURNO",
    nombre: "MO",
    descripcion: "SE INICIA EL PROCESO DE AIMS Y EXCEDENTES",
    accion: "INICIAR",
    estado: "INICIO EXITOSO",
    usuario: "bgalcia@spsolutions.com"
  },
  permisosUsuarios: [{
    nombre: "Leticia",
    apellidoPaterno: "Santos",
    apellidoMaterno: "",
    correo: "lsantos@principal.com",
    accion: "ACTIVAR",
    estado: "EXITOSO",
    rol: "EJECUTOR",
    detalleModificaciones: [{
      campo: "permisos",
      usuario: "bgalcia@spsolutions.com",
      valorAnterior: "Adimistrar catálogos",
      valorNuevo: "Monitoreo procesos"
    }]
  }]
};

var payloadString = JSON.stringify(payload);

@Injectable({
  providedIn: 'root'
})

export class AuditoriaService {
  params = {
    MessageBody: payloadString,
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/335672086802/sia-encolamiento-mensajes-monitoreo-dev"
  };

  constructor() { }

  enviarMensaje(): void {
    sqs.sendMessage(this.params, function (err, data) {
      if (err) {
        console.log("Error.", err);
      } else {
        console.log("Success.", data.MessageId);
      }
    });
  }
}
