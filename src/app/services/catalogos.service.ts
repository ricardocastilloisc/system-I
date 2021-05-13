import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  UrlCatalogos = environment.ENPOINT_RES.catalogos;
  constructor(private httpClient: HttpClient) {}
  getCatalogos = () => {
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
}
