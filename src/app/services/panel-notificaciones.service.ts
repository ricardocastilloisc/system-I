import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EArea, ENegocio } from '../validators/roles';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PanelNotificacionesService {
  url = environment.API.endpoints.find((el) => el.name === 'catalogos')['endpoint']

  constructor(private http: HttpClient, private AuthService: AuthService) {}
  getListadoNotificacionesSettings = () => {

    let QueryParams = new HttpParams();

    let array = [ENegocio.Afore, ENegocio.Fondos];

    if(localStorage.getItem('negocio')){
      QueryParams = QueryParams.append(
        'negocio',
        localStorage.getItem('negocio').toLowerCase()
      );
    }else{
      QueryParams = QueryParams.append(
        'negocio',
        array.toString().toLowerCase()
      );
    }
    return this.http
      .get(this.url + 'cloudwatchrules', {
        params: QueryParams,
        headers: this.AuthService.userHeaders(),
      })
      .toPromise();
  };
  updateNotificacionSettings = (ID, DataValues) => {

    if (typeof DataValues.enabled === 'string') {
      if(DataValues.enabled === 'false'){
        DataValues.enabled = false
      }else{
        DataValues.enabled = true
      }
    }

    return this.http
      .post(this.url + 'cloudwatchrules/' + ID, DataValues, {
        headers: this.AuthService.userHeaders(),
      })
      .toPromise();
  };
}
