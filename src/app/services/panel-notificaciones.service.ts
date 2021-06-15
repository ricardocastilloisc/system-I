import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EArea, ENegocio } from '../validators/roles';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PanelNotificacionesService {
  url = environment.ENPOINT_RES.catalogos;

  constructor(private http: HttpClient, private AuthService: AuthService) {}
  getListadoNotificacionesSettings = () => {

    let QueryParams = new HttpParams();

    let array = [ENegocio.Afore, ENegocio.Fondos, ENegocio.Seguros];

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
}
