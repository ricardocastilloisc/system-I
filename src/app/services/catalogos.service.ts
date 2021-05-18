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
        arrayTemp.push({
          PRIMARY_KEY: true,
          VALUE: res['PK'],
          TYPE: res[res['PK']],
          DATE: false,
        });

        //sentence.includes(word)
        const keys = Object.keys(res);
        keys.forEach((element) => {
          if (element !== 'PK') {
            const validator = arrayTemp.filter(
              (filt) => filt.VALUE === element
            );
            if (validator.length === 0) {
              arrayTemp.push({
                PRIMARY_KEY: false,
                VALUE: element,
                TYPE: res[element],
                DATE: element.includes('FECHA'),
              });
            }
          }
        });
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
    return this.httpClient.get(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat') + '/registros')
  }

  updateDetailsCat = (object) => {
    return this.httpClient
    .put(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat') + '/registros', object)
    .toPromise()
  }
  addDetailsCat = (object) => {
    return this.httpClient
    .post(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat') + '/registros', object)
    .toPromise()
  }

  deleteDetailsCat = (registro) => {
    return this.httpClient
    .delete(this.UrlCatalogos + 'catalogos/' + localStorage.getItem('nameCat') + '/registros/' + registro)
    .toPromise()
  }
}
