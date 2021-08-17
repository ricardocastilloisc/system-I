import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { LogeoService } from '../services/logeo.service';
import { json } from 'd3';
AWS.config.update({
  accessKeyId: environment.SESConfig.accessKeyId,
  secretAccessKey: environment.SESConfig.secretAccessKey,
  region: environment.SESConfig.region
});

const sqs = new AWS.SQS();

@Injectable({
  providedIn: 'root'
})

export class AuditoriaService {

  constructor(private logeo: LogeoService) { }

  enviarBitacoraUsuarios(objetoBitacora): void {

    const params = {
      MessageBody: objetoBitacora,
      MessageDeduplicationId: uuidv4(),
      MessageGroupId: uuidv4(),
      QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-auditoria').endpoint
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        this.logeo.registrarLog('AUDITORIA', 'EVIAR SQS', JSON.stringify(err));
      }
    });
  }

}
