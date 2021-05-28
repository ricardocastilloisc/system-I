import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { STRUCTURE_CAT } from '../model/catalogos/STRUCTURE_CAT.model';
import { EArea, ERole } from '../validators/roles';
import { AuditoriaService } from './auditoria.service';
import { AppState } from '../ReduxStore/app.reducers';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  UrlCatalogos = environment.ENPOINT_RES.catalogos;

  constructor(
    private httpClient: HttpClient,
    private store: Store<AppState>,
    private auditoria: AuditoriaService,
    private AuthService: AuthService
  ) {}
  getCatalogos = () => {
    let area = localStorage.getItem('area');

    if (area.split(',').includes(EArea.Soporte)) {
      return this.httpClient.get(this.UrlCatalogos + 'catalogos', {
        headers: this.AuthService.userHeaders(),
      });
    }
    let QueryParams = new HttpParams();
    QueryParams = QueryParams.append(
      'negocio',
      localStorage.getItem('negocio')
    );
    QueryParams = QueryParams.append('area', localStorage.getItem('area'));
    return this.httpClient.get(this.UrlCatalogos + 'catalogos', {
      params: QueryParams,
      headers: this.AuthService.userHeaders(),
    });
  };

  structureCat = () => {
    let array = null;

    this.httpClient
      .get(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat'), {
        headers: this.AuthService.userHeaders(),
      })
      .toPromise()
      .then((res: any) => {
        let arrayTemp: STRUCTURE_CAT[] = [];

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
  };

  getDetailsCat = () => {
    let nextTokenValidator = 'next';

    let arrayRes = [];

    this.httpClient
      .get(
        this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros',
        {
          headers: this.AuthService.userHeaders(),
        }
      )
      .toPromise()
      .then(({ nextToken, registros }: any) => {
        arrayRes = [...registros];
        nextTokenValidator = nextToken;
      });

    return new Promise((resolve) => {
      const intervalo = setInterval(() => {
        if (nextTokenValidator === null) {
          resolve({ registros: arrayRes });
          clearInterval(intervalo);
        } else {
          if (nextTokenValidator !== 'next') {
            let QueryParams = new HttpParams();
            QueryParams = QueryParams.append('nextToken', nextTokenValidator);

            this.httpClient
              .get(
                this.UrlCatalogos +
                  'catalogos/' +
                  localStorage.getItem('nameCat') +
                  '/registros',
                {
                  params: QueryParams,
                  headers: this.AuthService.userHeaders(),
                }
              )
              .toPromise()
              .then(({ nextToken, registros }: any) => {
                if (!arrayRes.includes(registros[0])) {
                  arrayRes = [...arrayRes, ...registros];
                }

                if (nextTokenValidator !== nextToken) {
                  if (nextTokenValidator) {
                    nextTokenValidator = nextToken;
                  }
                }
              });
          }
        }
      }, 1000);
    });
  };

  updateDetailsCat = (object) => {
    return this.httpClient
      .put(
        this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros',
        object,
        {
          headers: this.AuthService.userHeaders(),
        }
      )
      .toPromise();
  };

  addDetailsCat = (object) => {
    return this.httpClient
      .post(
        this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros',
        object,
        {
          headers: this.AuthService.userHeaders(),
        }
      )
      .toPromise();
  };

  deleteDetailsCat = (registro) => {
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
          headers: this.AuthService.userHeaders(),
        }
      )
      .toPromise();
  };

  generarAuditoria(estado: string): void {
    const catalogo = localStorage.getItem('nameCat');
    const newRegister = localStorage.getItem('ObjectNewRegister');
    const oldRegister = localStorage.getItem('ObjectOldRegister');
    const accion = localStorage.getItem('RegisterAction');

    const today = new Date().toISOString();

    let area: String = '';
    let rol = '';
    let correo = '';
    let apellidoPaterno = '';
    let nombre = '';

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
      modulo: 'CATALOGOS',
      usuario: {
        apellidoPaterno: apellidoPaterno,
        nombre: nombre,
      },
      catalogos: {
        nombre: catalogo,
        accion: accion,
        estado: estado,
        descripcion:
          'Se realizó la acción de ' +
          accion +
          ' sobre el catálogo ' +
          catalogo +
          '.',
        detalleModificaciones: [
          {
            valorAnterior: JSON.parse(oldRegister),
            valorNuevo: JSON.parse(newRegister),
          },
        ],
      },
    };

    //console.log("payload", payload);

    const payloadString = JSON.stringify(payload);

    this.auditoria.enviarBitacoraUsuarios(payloadString);

    localStorage.removeItem('RegisterAction');
    localStorage.removeItem('ObjectNewRegister');
    localStorage.removeItem('ObjectOldRegister');
  }
}
