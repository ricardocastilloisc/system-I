import { Injectable } from '@angular/core';
import Amplify from 'aws-amplify';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  accessKeyId: environment.SESConfig.accessKeyId,
  secretAccessKey: environment.SESConfig.secretAccessKey,
  region: environment.SESConfig.region
});

var sqs = new AWS.SQS();

var payload = { /* este objeto se llenara por cada pantalla/proceso que se lanza */
  areaNegocio: "TESORERÍA",
  rol: "Soporte",
  correo: "garcia.diego@principal.com",
  fecha: "2021-03-22T20:32:43.838-06:00",
  usuario: {
    apellidoPaterno: "Garcia",
    apellidoMaterno: "Diaz",
    nombre: "Diego",
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
    MessageDeduplicationId: uuidv4(),  // Required for FIFO queues
    MessageGroupId: uuidv4(),  // Required for FIFO queues
    QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-auditoria')['endpoint']
  };

  paramsReceive = {
    AttributeNames: [
      "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      "All"
    ],
    QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-auditoria')['endpoint'],
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
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

  recibirMensaje(): void {
    sqs.receiveMessage(this.paramsReceive, function (err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        var deleteParams = {
          QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-auditoria')['endpoint'],
          ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    });
  }


  enviarBitacoraUsuarios(objetoBitacora): void {

    //console.log("objetoBitacora", objetoBitacora);

    let params = {
      MessageBody: objetoBitacora,
      MessageDeduplicationId: uuidv4(),  // Required for FIFO queues
      MessageGroupId: uuidv4(),  // Required for FIFO queues
      QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-auditoria')['endpoint']
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log("Error.", err);
      } else {
        //console.log("Success.", data.MessageId);
      }
    });
  }

}
