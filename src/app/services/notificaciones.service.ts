import { Injectable } from '@angular/core';
import { APIService } from '../API.service';

import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '../ReduxStore/app.reducers';
import { setnotificaciones } from '../ReduxStore/actions';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  constructor(private api: APIService, private store: Store<AppState>) {}

  obtenerListadoDeNotificaciones = () => {
    console.log('obtenerListadoDeNotificaciones');
    this.api
      .ListSiaGenAudEstadoProcesosDevsPorFecha(
        moment('7:59', 'HH:mm').format().toString()
      )
      .then(({ items }) => {
        console.log('obtenerListadoDeNotificaciones', items);
        let ArrayItems = [
          ...items.filter((e) => e.ESTADO_EJECUCION === 'TERMINADO'),
        ];

        if (!JSON.parse(localStorage.getItem('Notificaciones'))) {
          let notificacionesTemportal = [];

          ArrayItems.forEach((e) => {
            notificacionesTemportal.push({
              ...e,
              LEIDO: false,
            });
          });

          localStorage.setItem(
            'Notificaciones',
            JSON.stringify(notificacionesTemportal)
          );
        } else {
          let tempNoticicaciones = JSON.parse(
            localStorage.getItem('Notificaciones')
          );

          let NuevasNotificaciones = [];

          ArrayItems.forEach((elementoArray) => {
            let ArrayComparacion = tempNoticicaciones.filter(
              (e) => e.ID_PROCESO === elementoArray.ID_PROCESO
            );
            if (ArrayComparacion.length === 0) {
              NuevasNotificaciones.push({
                ...elementoArray,
                LEIDO: false,
              });
            }
          });

          let notificacionesTemportal = [
            ...NuevasNotificaciones,
            ...tempNoticicaciones,
          ];

          localStorage.setItem(
            'Notificaciones',
            JSON.stringify(notificacionesTemportal)
          );
        }

        let notificacionesRedux = JSON.parse(
          localStorage.getItem('Notificaciones')
        );

        this.store.dispatch(
          setnotificaciones({ notificaciones: notificacionesRedux })
        );
      });
  };

  newNotificacion = (newElemet) => {
    let tempNoticicaciones = JSON.parse(localStorage.getItem('Notificaciones'));
    tempNoticicaciones.push({
      ...newElemet,
      LEIDO: false,
    });

    localStorage.setItem('Notificaciones', JSON.stringify(tempNoticicaciones));

    let notificacionesRedux = JSON.parse(
      localStorage.getItem('Notificaciones')
    );

    this.store.dispatch(
      setnotificaciones({ notificaciones: notificacionesRedux })
    );
  };

  eliminarNoticiaciones = (ID_PROCESO: string) => {
    setTimeout(() => {
      let NotificacionesArrayLocal = JSON.parse(
        localStorage.getItem('Notificaciones')
      );
      let NuevoArrayNotificaciones = NotificacionesArrayLocal.map((e) => {
        if (e.ID_PROCESO === ID_PROCESO) {
          e.LEIDO = true;
        }
        return e;
      });
      localStorage.setItem(
        'Notificaciones',
        JSON.stringify(NuevoArrayNotificaciones)
      );
      this.store.dispatch(
        setnotificaciones({ notificaciones: NuevoArrayNotificaciones })
      );
    }, 100);
  };
}
