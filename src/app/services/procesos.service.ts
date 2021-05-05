import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

let uuid = uuidv4();

@Injectable({
  providedIn: 'root',
})

export class ProcesosService {

  constructor(
    private authService: AuthService
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

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        response = response.data;
      })
      .catch(function (error) {
        console.log(error);
        response = error;
      });

    return response;
  }
}
