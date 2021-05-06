import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

let uuid = uuidv4();

@Injectable({
  providedIn: 'root',
})

export class ProcesosService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  iniciarProceso(idProceso: string, correoUsuario: string, rolUsuario: string): any {
    let response;
    var axios = require('axios');
    var data = JSON.stringify({
      "rol": rolUsuario,
      "correo": correoUsuario,
      "uuid": uuid
    });
    var endpoint = environment.API.endpoints.find((el) => el.name === idProceso)['endpoint'];
    var config = {
      method: 'post',
      url: endpoint,
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken(),
        'Content-Type': 'application/json'
      },
      data: data
    };
    var headers = {
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'Content-Type': 'application/json'
    }

    return this.http.post(endpoint, config.data, {headers}).toPromise().then(function (response) {
      //console.log(JSON.stringify(response.data));
      /*
      {"message":"AIMS y EXCEDENTES start"}
       */
      //response = response.data;
      return response = {
        codigo: 'EXITO',
        descripcion: 'La solicitud fue exitosa.'
      };
    })
    .catch(function (error) {
      //console.log(JSON.stringify(error));
      //response = error;
      return response = {
        codigo: 'FALLO',
        descripcion: error.message
      };
      //console.log(response);
    });
;

    axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
        /*
        {"message":"AIMS y EXCEDENTES start"}
         */
        //response = response.data;
        response = {
          codigo: 'EXITO',
          descripcion: 'La solicitud fue exitosa.'
        };
      })
      .catch(function (error) {
        //console.log(JSON.stringify(error));
        //response = error;
        response = {
          codigo: 'FALLO',
          descripcion: error.message
        };
        //console.log(response);
      });

    return response;
  }
}
