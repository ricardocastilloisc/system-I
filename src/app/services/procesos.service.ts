import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../ReduxStore/app.reducers';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root',
})

export class ProcesosService {

  private subjectName = new Subject<any>();

  sendUpdate(message: string) {
    this.subjectName.next({ text: message });
  }

  getUpdate(): Observable<any> {
    return this.subjectName.asObservable();
  }

  constructor(
    private store: Store<AppState>, private authService: AuthService, private auditoria: AuditoriaService,
    private http: HttpClient
  ) { }

  iniciarProceso(idProceso: string, correoUsuario: string, rolUsuario: string): any {
    let response;
    let uuid = uuidv4();
    let data = JSON.stringify({
      'rol': rolUsuario,
      'correo': correoUsuario,
      'uuid': uuid
    });
    let endpoint = environment.API.endpoints.find((el) => el.name === idProceso).endpoint;
    let config = {
      url: endpoint,
      headers: {
        'Authorization': 'Bearer ' + this.authService.getToken(),
        'Content-Type': 'application/json'
      },
      data: data
    };
    let headers = {
      'Authorization': 'Bearer ' + this.authService.getToken(),
      'Content-Type': 'application/json'
    };

    return this.http.post(endpoint, config.data, { headers }).toPromise().then(function (response) {
      return response = {
        codigo: 'EXITO',
        descripcion: 'La solicitud fue exitosa.',
        idProceso: JSON.parse(data).uuid
      };
    })
      .catch(function (error) {
        return response = {
          codigo: 'FALLO',
          descripcion: error.message
        };
      });
  }

  generarAuditoria(estado: string, resultado: string, idProceso?): void {
    const proceso = JSON.parse(localStorage.getItem('proceso'));
    const today = new Date().toISOString();
    let tipo = '';
    let area: String = '';
    let rol = '';
    let correo = '';
    let apellidoPaterno = '';
    let nombre = '';
    if (localStorage.getItem('tipoProceso')) {
      tipo = localStorage.getItem('tipoProceso');
    } else {
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
        idProceso: idProceso,
        sigla: proceso.sigla,
        nombre: proceso.nombre,
        descripcion: resultado,
        accion: 'INICIAR',
        estado: estado,
        tipo: tipo
      },
    };
    const payloadString = JSON.stringify(payload);
    this.auditoria.enviarBitacoraUsuarios(payloadString);
    localStorage.removeItem('proceso');
    localStorage.removeItem('tipoProceso');

  }
}
