import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NotificacionesService {

  constructor() { }

  filtrarNotificaciones(fechaInicio): any{
    let response;
    console.log(fechaInicio);
    return response
  }

}
