import { NOTIFICACION_INTERFACE } from './../model/notificacion.model';
import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'ordenarNotificacionesFecha'
})
export class OrdenarNotificacionesFechaPipe implements PipeTransform {

  transform(Notificaciones: NOTIFICACION_INTERFACE []): NOTIFICACION_INTERFACE[] {
    return  [...Notificaciones].sort((a, b) => {
      if (
        !a.hasOwnProperty('FECHA_FINALIZADO') ||
        !b.hasOwnProperty('FECHA_FINALIZADO')
      ) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = moment(a.FECHA_FINALIZADO)

      const varB = moment(b.FECHA_FINALIZADO)


      let comparison = 0;
      if (varA > varB) {
        comparison = -1;
      } else if (varA < varB) {
        comparison = 1;
      }
      return comparison;
    });
  }

}
