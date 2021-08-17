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

  //en etsa seccion solo es para ver el catalogo que necestimos en el bucket
  generarConexionS3 = (Bucket, Key) => {
    console.log('generarConexionS3');
    // obtener la url prefirmada para el visualizador
    const params = {
      Bucket: '**bucket**', /* este dato lo devolvera el API */
      Key: '**key**', /* este dato lo devolvera el API */
      Expires: 3600,
    };
    const url = s3.getSignedUrl('getObject', params);
    return url
  }
}
