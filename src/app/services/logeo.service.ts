import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';
import { AppState } from '../ReduxStore/app.reducers';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
AWS.config.update({
  accessKeyId: environment.SESConfig.accessKeyId,
  secretAccessKey: environment.SESConfig.secretAccessKey,
  region: environment.SESConfig.region
});
const cloudWatchLogs = new AWS.CloudWatchLogs();

@Injectable({
  providedIn: 'root'
})
export class LogeoService {

  constructor(private store: Store<AppState>) { }

  registrarLog(paramModulo: string, paramAccion: string, paramMensaje: string): void {
    this.store.select(({ usuario }) => usuario.user).subscribe(res => {
      const a = new Date;
      const date = new Date();
      const stream = moment(date).format('YYYY-MM-DD');
      let token = '';
      const paramsStream = {
        logGroupName: environment.logGroup,
        logStreamNamePrefix: stream
      };
      let logData;
      cloudWatchLogs.describeLogStreams(paramsStream, function (err, data) {
        logData = data;
        if (data.logStreams.length < 1) {
          const paramsCreateStream = {
            logGroupName: environment.logGroup,
            logStreamName: stream
          };
          cloudWatchLogs.createLogStream(paramsCreateStream, function (err, data) {
            if (data) {
              logData = data;
            }
          });
        }
        token = logData.logStreams[0].uploadSequenceToken;
        const body = {
          usuario: res.email,
          fecha: Date,
          modulo: paramModulo,
          accion: paramAccion,
          mensaje: paramMensaje,
        };
        const paramsEvent = {
          logEvents: [
            {
              message: JSON.stringify(body),
              timestamp: Date.now()
            }
          ],
          logGroupName: environment.logGroup,
          logStreamName: stream,
          sequenceToken: token
        };
        cloudWatchLogs.putLogEvents(paramsEvent, function (err, data) {
          // console.log('err', err, 'data', data);
        });
      });
    });
  }

}
