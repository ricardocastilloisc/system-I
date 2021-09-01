import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { STRUCTURE_CAT } from '../model/catalogos/STRUCTURE_CAT.model';
import { AuditoriaService } from './auditoria.service';
import { AppState } from '../ReduxStore/app.reducers';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { LogeoService } from '../services/logeo.service';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';

/* Confirugracion del SDK para usar el servicios de SQS */
/* El origden de estos datos son variables de entorno configuradas en amplify */
AWS.config.update({
  accessKeyId: environment.SESConfig.accessKeyId,
  secretAccessKey: environment.SESConfig.secretAccessKey,
  region: environment.SESConfig.region
});

const sqs = new AWS.SQS();

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  UrlCatalogos = environment.API.endpoints.find((el) => el.name === 'catalogos').endpoint;

  constructor(
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private auditoria: AuditoriaService,
    private authServcie: AuthService,
    private logeo: LogeoService
  ) { }

  getCatalogos = () => {
    try {
      const area = localStorage.getItem('area');
      let QueryParams = new HttpParams();
      QueryParams = QueryParams.append(
        'negocio',
        localStorage.getItem('negocio')
      );
      QueryParams = QueryParams.append('area', localStorage.getItem('area'));
      return this.httpClient.get(this.UrlCatalogos + 'catalogos', {
        params: QueryParams,
        headers: this.authServcie.userHeaders(),
      });
    } catch (err) {
      this.logeo.registrarLog('CATALOGOS', 'CONSULTAR', JSON.stringify(err));
    }
  }

  structureCat = () => {
    try {
      let array = null;
      this.httpClient
        .get(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat'), {
          headers: this.authServcie.userHeaders(),
        })
        .toPromise()
        .then((res: any) => {
          const arrayTemp: STRUCTURE_CAT[] = [];
          res
            .filter((e) => e.llavePrimaria === true)
            .forEach((r) => arrayTemp.push(r));
          res
            .filter((e) => e.llavePrimaria === false)
            .forEach((r) => arrayTemp.push(r));
          array = arrayTemp;
        });
      return new Promise((resolve) => {
        const intervalo = setInterval(() => {
          if (array) {
            resolve(array);
            clearInterval(intervalo);
          }
        }, 100);
      });
    } catch (err) {
      this.logeo.registrarLog('CATALOGOS', 'CONSULTAR ESTRUCTURA', JSON.stringify(err));
    }
  }

  getDetailsCat = (token) => {
    try {
      let nextTokenValidator = 'next';
      let arrayRes = [];
      if (token) {
        let QueryParams = new HttpParams();
        QueryParams = QueryParams.append('nextToken', token);
        this.httpClient
          .get(
            this.UrlCatalogos +
            'catalogos/' +
            localStorage.getItem('nameCat') +
            '/registros',
            {
              params: QueryParams,
              headers: this.authServcie.userHeaders(),
            }
          )
          .toPromise()
          .then(({ nextToken, registros }: any) => {
            this.setValoresPaginado(token, nextToken);
            arrayRes = [...registros];
            nextTokenValidator = null;
          })
          .catch(() => {
            arrayRes = [{ error: true }];
            nextTokenValidator = null;
          });
      } else {
        this.httpClient
          .get(
            this.UrlCatalogos +
            'catalogos/' +
            localStorage.getItem('nameCat') +
            '/registros',
            {
              headers: this.authServcie.userHeaders(),
            }
          )
          .toPromise()
          .then(({ nextToken, registros }: any) => {
            arrayRes = [...registros];
            this.setValoresPaginado(token, nextToken);
            nextTokenValidator = null;
          })
          .catch(() => {
            arrayRes = [{ error: true }];
            nextTokenValidator = null;
          });
      }
      return new Promise((resolve) => {
        const intervalo = setInterval(() => {
          if (nextTokenValidator === null) {
            resolve({ registros: arrayRes });
            clearInterval(intervalo);
          }
        }, 1000);
      });
    } catch (err) {
      this.logeo.registrarLog('CATALOGOS', 'CONSULTAR DETALLE', JSON.stringify(err));
    }
  }

  setValoresPaginado = (token, nextToken) => {
    const tokenPageActuality = localStorage.getItem('tokenPageActuality');
    if (token !== null) {
      if (tokenPageActuality !== token) {
        const tokenTemp = tokenPageActuality;
        const PageNumerPageCat = JSON.parse(
          localStorage.getItem('izquierdaOderecha')
        );
        if (PageNumerPageCat === 1) {
          localStorage.setItem('tokenPageBefore', tokenTemp);
          localStorage.setItem('tokenPageActuality', token);
          localStorage.setItem('tokenPageNext', nextToken);
          localStorage.removeItem('izquierdaOderecha');

          if (!localStorage.getItem('Paginas')) {
            const array = [
              {
                token: 'null',
                page: '0',
              },
              {
                token,
                page: JSON.parse(localStorage.getItem('PageNumerPageCat')),
              },
            ];

            localStorage.setItem('Paginas', JSON.stringify(array));
          } else {
            const Paginas = JSON.parse(localStorage.getItem('Paginas'));

            const arrayPaginas = Paginas.filter(
              (e) =>
                e.page === JSON.parse(localStorage.getItem('PageNumerPageCat'))
            );

            if (arrayPaginas.length < 1) {
              Paginas.push({
                token,
                page: JSON.parse(localStorage.getItem('PageNumerPageCat')),
              });
            }
            localStorage.setItem('Paginas', JSON.stringify(Paginas));
          }

        } else {
          const Paginas = JSON.parse(localStorage.getItem('Paginas'));

          const arrayPaginas = Paginas.filter(
            (e) =>
              e.page === JSON.parse(localStorage.getItem('PageNumerPageCat')) - 1
          );

          let page = 0;
          if (arrayPaginas.length > 0) {
            page = arrayPaginas[0].token;
          }

          const pagefinal = page === 0 ? 'null' : page.toLocaleString();

          localStorage.setItem('tokenPageBefore', pagefinal);
          localStorage.setItem('tokenPageActuality', token);
          localStorage.setItem('tokenPageNext', nextToken);
          localStorage.removeItem('izquierdaOderecha');
        }
      }
    } else {
      localStorage.setItem('tokenPageBefore', 'null');
      localStorage.setItem('tokenPageActuality', token);
      localStorage.setItem('tokenPageNext', nextToken);
    }
  }

  updateDetailsCat = (object) => {
    try {
      return this.httpClient
        .put(
          this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros',
          object,
          {
            headers: this.authServcie.userHeaders(),
          }
        )
        .toPromise();
    } catch (err) {
      this.logeo.registrarLog('CATALOGOS', 'ACTUALIZAR', JSON.stringify(err));
    }
  }

  addDetailsCat = (object) => {
    try {
      return this.httpClient
        .post(
          this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros',
          object,
          {
            headers: this.authServcie.userHeaders(),
          }
        )
        .toPromise();
    } catch (err) {
      this.logeo.registrarLog('CATALOGOS', 'AGREGAR', JSON.stringify(err));
    }
  }

  deleteDetailsCat = (registro) => {
    try {
      let stringCode = '';
      if (typeof registro === 'string') {
        stringCode = registro;
      } else {
        stringCode = registro.toString();
      }
      return this.httpClient
        .delete(
          this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros/' +
          window.btoa(unescape(encodeURIComponent(registro))),
          {
            headers: this.authServcie.userHeaders(),
          }
        )
        .toPromise();
    } catch (err) {
      this.logeo.registrarLog('CATALOGOS', 'ELIMINAR', JSON.stringify(err));
    }
  }

  /*
  Funcion que se encarga de mandar al servicio de auditoria los datos de seguimiento para las actualizaciones
  generadas sobre los catalogos
  Datos de entrada:
      estado: string
  Datos de salida: NA
  */
  generarAuditoria(estado: string): void {
    try {
      /* Generacion del payload a enviar a la auditoria */
      const catalogo = localStorage.getItem('nameCat');
      const descripcion = localStorage.getItem('negocioCat');
      const newRegister = localStorage.getItem('ObjectNewRegister');
      const oldRegister = localStorage.getItem('ObjectOldRegister');
      const accion = localStorage.getItem('RegisterAction');
      const today = new Date().toISOString();
      let area: String = '';
      let rol = '';
      let correo = '';
      let apellidoPaterno = '';
      let nombre = '';
      let negocio = '';
      this.store
        .select(({ usuario }) => usuario.user)
        .subscribe((res) => {
          rol = res.attributes['custom:rol'];
          negocio = res.attributes['custom:negocio'].toLowerCase();
          correo = res.email;
          nombre = res.attributes.given_name;
          apellidoPaterno = res.attributes.family_name;
        });
      this.store
        .select(({ usuario }) => usuario.area)
        .subscribe((res) => {
          area = res;
        });
      const payload = {
        areaNegocio: area,
        rol,
        correo,
        fecha: today,
        modulo: 'CATALOGOS',
        usuario: {
          apellidoPaterno,
          nombre,
        },
        catalogos: {
          nombre: catalogo,
          accion,
          estado,
          descripcion,
          detalleModificaciones: [
            {
              valorAnterior: JSON.parse(oldRegister),
              valorNuevo: JSON.parse(newRegister),
            },
          ],
        },
      };
      const payloadString = JSON.stringify(payload);
      /* enviar al servicio de auditoria para registrar los datos en la bitacora */
      this.auditoria.enviarBitacoraUsuarios(payloadString);
      /* enviar a la funcion de notificaciones para generar la notificacion correspondiente en el canal de teams */
      this.enviarNotificacion(descripcion, accion, nombre, apellidoPaterno, negocio);
      localStorage.removeItem('RegisterAction');
      localStorage.removeItem('ObjectNewRegister');
      localStorage.removeItem('ObjectOldRegister');
    } catch (err) {
      /* registro de error producido */
      this.logeo.registrarLog('CATALOGOS', 'GENERAR AUDITORIA', JSON.stringify(err));
    }
  }

  /*
  Funcion que se encarga de publicar en la Queue de Notificaciones de Catalogos un mensaje
  con los datos de actualizacion para enviar a un canal de teams las notificación del cambio en el catalogo
  Datos de entrada:
      catalogo: string --> Ej. Monedas
      accion: string --> Ej. AGREGAR
      nombre: string --> Ej. Juan
      apellidoPaterno: string --> Ej. Perez
      negocio: string --> Ej. Afore,Fondos
  Datos de salida: NA
  */
  enviarNotificacion(catalogo: string, accion: string, nombre: string, apellidoPaterno: string, negocio: string): void {
    try {
      /* generacion detallada del mensaje */
      if (accion === 'AGREGAR') {
        accion = 'Se agregó un registro al catálogo'
      }
      if (accion === 'ELIMINAR') {
        accion = 'Se eliminó un registro del catálogo'
      }
      if (accion === 'ACTUALIZAR') {
        accion = 'Se actualizó la información de un registro del catálogo'
      }
      /* generacion del payload a enviar*/
      const payload = {
        catalogo: catalogo,
        accion: accion,
        usuario: nombre + ' ' + apellidoPaterno,
        negocio: negocio
      };
      const objetoBitacora = JSON.stringify(payload);
      const params = {
        MessageBody: objetoBitacora,
        MessageDeduplicationId: uuidv4(),
        MessageGroupId: uuidv4(),
        QueueUrl: environment.API.endpoints.find((el) => el.name === 'sqs-catalogos').endpoint
      };
      /* publicacion en el queue de notificaciones catalogos*/
      sqs.sendMessage(params, function (err, data) {
        if (err) {
          /* registro de error si no se pudo lanzar la solicitud */
          this.logeo.registrarLog('CATALOGOS', 'ENVIAR SQS NOTIFICACIONES', JSON.stringify(err));
        }
      });
    } catch (err) {
      /* registro de error producido */
      this.logeo.registrarLog('CATALOGOS', 'GENERAR AUDITORIA', JSON.stringify(err));
    }
  }

}
