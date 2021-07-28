import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';

AWS.config.update({
  accessKeyId: environment.SESConfig.accessKeyId,
  secretAccessKey: environment.SESConfig.secretAccessKey,
  region: environment.SESConfig.region
});

const s3 = new AWS.S3();


@Injectable({
  providedIn: 'root'
})
export class S3Service {

  constructor() { }


  generarConexionS3 = (Bucket, Key) => {
    console.log('generarConexionS3');
    // obtener la url prefirmada para el visualizador
    const params = {
      Bucket: 'sia-frontend-poc-csv', /* este dato lo devolvera el API */
      Key: 'sia-gen-adm-diccionario-catalogos-dev.csv', /* este dato lo devolvera el API */
      Expires: 3600,
    };
    const url = s3.getSignedUrl('getObject', params);
    return url
  }
}
