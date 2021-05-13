import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    let uuid = uuidv4();
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

    return this.http.post(endpoint, config.data, { headers }).toPromise().then(function (response) {
      return response = {
        codigo: 'EXITO',
        descripcion: 'La solicitud fue exitosa.'
      };
    })
      .catch(function (error) {
        return response = {
          codigo: 'FALLO',
          descripcion: error.message
        };
      });
    ;
  }
}
