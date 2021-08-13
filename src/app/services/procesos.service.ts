import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../ReduxStore/app.reducers';
import { AuditoriaService } from './auditoria.service';
import { LogeoService } from '../services/logeo.service';
@Injectable({
  providedIn: 'root',
})

export class ProcesosService {

  private subjectName = new Subject<any>();

  sendUpdate(message: string): void {
    this.subjectName.next({ text: message });
  }

  getUpdate(): Observable<any> {
    return this.subjectName.asObservable();
  }

  constructor(
    private store: Store<AppState>, private authService: AuthService, private auditoria: AuditoriaService,
    private http: HttpClient, private logeo: LogeoService
  ) { }

  /* Funcion para mandar la solicitud al API de procesos para iniciar un flujo*/
  iniciarProceso(idProceso: string, correoUsuario: string, rolUsuario: string): any {
    let response;
    try {
      /* Generar solcitidud */
      const uuid = uuidv4();
      const data = JSON.stringify({
        rol: rolUsuario,
        correo: correoUsuario,
        uuid: uuid
      });
      /* Generar encabezados de la solicitud */
      const endpoint = environment.API.endpoints.find((el) => el.name === idProceso).endpoint;
      const config = {
        url: endpoint,
        headers: {
          Authorization: 'Bearer ' + this.authService.getToken(),
          'Content-Type': 'application/json'
        },
        data
      };
      const headers = {
        Authorization: 'Bearer ' + this.authService.getToken(),
        'Content-Type': 'application/json'
      };
      /* Enviar la solicitud con los parametros configurados */
      return this.http.post(endpoint, config.data, { headers }).toPromise().then(function (response) {
        return response = {
          codigo: 'EXITO',
          descripcion: 'La solicitud fue exitosa.',
          idProceso: JSON.parse(data).uuid
        };
      })
        .catch(function (error) {
          /* Cachar el fallo al procesar la solicitud  */
          this.logeo.registrarLog('PROCESOS', 'INICIAR', JSON.stringify(error));
          return response = {
            codigo: 'FALLO',
            descripcion: error.message
          };
        });
    } catch (err) {
      /* Cachar el fallo al intentar procesar la solicitud */
      this.logeo.registrarLog('PROCESOS', 'INICIAR', JSON.stringify(err));
      return response = {
        codigo: 'FALLO',
        descripcion: err.message + '. Para el proceso ' + idProceso
      };
    }
  }

  /* Funcion para generar los datos de la auditoria */
  generarAuditoria(estado: string, resultado: string, idProceso?): void {
    try {
      /* Obtencion de los datos a mandar a la bitacora */
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
      /* Generar el payload a mandar a la bitacora */
      const payload = {
        areaNegocio: area,
        rol,
        correo,
        fecha: today,
        modulo: 'PROCESOS',
        usuario: {
          apellidoPaterno,
          nombre,
        },
        procesos: {
          idProceso,
          sigla: proceso.sigla,
          nombre: proceso.nombre,
          descripcion: resultado,
          accion: 'INICIAR',
          estado,
          tipo
        },
      };
      const payloadString = JSON.stringify(payload);
      /* Mandar la informacion al servicio de bitacora */
      this.auditoria.enviarBitacoraUsuarios(payloadString);
      localStorage.removeItem('proceso');
      localStorage.removeItem('tipoProceso');
    } catch (err) {
      /* Cachar el fallo al mandar la informacion a la bitacora */
      this.logeo.registrarLog('PROCESOS', 'GENERAR AUDITORIA', JSON.stringify(err));
    }
  }

}
