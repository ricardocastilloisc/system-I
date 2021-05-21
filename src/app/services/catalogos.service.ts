import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { STRUCTURE_CAT } from '../model/catalogos/STRUCTURE_CAT.model';
import { EArea, ERole } from '../validators/roles';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  UrlCatalogos = environment.ENPOINT_RES.catalogos;

  constructor(private httpClient: HttpClient) {}
  getCatalogos = () => {
    let area = localStorage.getItem('area');

    if (area.split(',').includes(EArea.Soporte)) {
      return this.httpClient.get(this.UrlCatalogos + 'catalogos');
    }
    let QueryParams = new HttpParams();
    QueryParams = QueryParams.append(
      'negocio',
      localStorage.getItem('negocio')
    );
    QueryParams = QueryParams.append('area', localStorage.getItem('area'));
    return this.httpClient.get(this.UrlCatalogos + 'catalogos', {
      params: QueryParams,
    });
  };

  structureCat = () => {
    let array = null;

    this.httpClient
      .get(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat'))
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

    //nextToken

    this.httpClient
      .get(
        this.UrlCatalogos +
          'catalogos/' +
          localStorage.getItem('nameCat') +
          '/registros'
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
        object
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
        object
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
          window.btoa(unescape(encodeURIComponent(registro)))
      )
      .toPromise();
  };
}
