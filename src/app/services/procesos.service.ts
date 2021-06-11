import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../ReduxStore/app.reducers';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root',
})

export class ProcesosService {

  constructor(
    private store: Store<AppState>, private authService: AuthService, private auditoria: AuditoriaService,
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
      //console.log("Respuesta llamado proceso",response)
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

  generarAuditoria(estado: string, resultado: string): void {
    const proceso = JSON.parse(localStorage.getItem('proceso'));
    const today = new Date().toISOString();
    let tipo = localStorage.getItem('tipoProceso');

    let area: String = '';
    let rol = '';
    let correo = '';
    let apellidoPaterno = '';
    let nombre = '';

    if (tipo === null) {
      tipo = 'DIURNO';
    }

    this.store
      .select(({ usuario }) => usuario.user)
      .subscribe((res) => {
        rol = res.attributes['custom:rol'];
        correo = res.email;
        nombre = res.attributes.given_name;
        apellidoPaterno = res.attributes.family_name;
      });
    this.store
      .select(({ usuario }) => usuario.area)
      .subscribe((res) => {
        //console.log(res)
        area = res;
      });

    let payload = {
      areaNegocio: area,
      rol: rol,
      correo: correo,
      fecha: today,
      modulo: 'PROCESOS',
      usuario: {
        apellidoPaterno: apellidoPaterno,
        nombre: nombre,
      },
      procesos: {
        nombre: proceso.descripcion,
        descripcion: resultado,
        accion: "INICIAR",
        estado: estado,
        tipo: proceso.tipo
      },
    };

    //console.log("payload", payload);

    const payloadString = JSON.stringify(payload);

    this.auditoria.enviarBitacoraUsuarios(payloadString);

    localStorage.removeItem('proceso');
    localStorage.removeItem('tipoProceso');

  }
}
