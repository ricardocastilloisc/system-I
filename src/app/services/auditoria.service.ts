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

@Injectable({
  providedIn: 'root'
})

export class AuditoriaService {

  constructor() { }

  enviarBitacoraUsuarios(objetoBitacora): void {

    const params = {
      MessageBody: objetoBitacora,
      MessageDeduplicationId: uuidv4(),  // Required for FIFO queues
      MessageGroupId: uuidv4(),  // Required for FIFO queues
      QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-auditoria')['endpoint']
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        // console.log("Error.", err);
      } else {
        // console.log("Success.", data.MessageId);
      }
    });
  }

}
