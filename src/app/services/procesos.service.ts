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
        'Authorization': 'Bearder ' + this.authService.getToken(),
        'Content-Type': 'application/json'
      },
      data: data
    };

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
