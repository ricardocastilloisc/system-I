import { Injectable } from '@angular/core';
import { APIService } from '../API.service';
import { LogeoService } from '../services/logeo.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '../ReduxStore/app.reducers';
import { setnotificaciones } from '../ReduxStore/actions';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  constructor(
    private api: APIService,
    private store: Store<AppState>,
    private logeo: LogeoService
  ) { }

  obtenerListadoDeNotificaciones = () => {
    try {
      this.api
        .ListSiaGenAudEstadoProcesosDevsPorFecha(
          moment('7:59', 'HH:mm').format().toString()
        )
        .then(({ items }) => {
          const ArrayItems = [
            ...items.filter((e) => e.ESTADO_EJECUCION === 'TERMINADO'),
          ];
          if (!JSON.parse(localStorage.getItem('Notificaciones'))) {
            const notificacionesTemportal = [];
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
            const tempNoticicaciones = JSON.parse(
              localStorage.getItem('Notificaciones')
            );
            const NuevasNotificaciones = [];
            ArrayItems.forEach((elementoArray) => {
              const ArrayComparacion = tempNoticicaciones.filter(
                (e) => e.ID_PROCESO === elementoArray.ID_PROCESO
              );
              if (ArrayComparacion.length === 0) {
                NuevasNotificaciones.push({
                  ...elementoArray,
                  LEIDO: false,
                });
              }
            });
            const notificacionesTemportal = [
              ...NuevasNotificaciones,
              ...tempNoticicaciones,
            ];
            localStorage.setItem(
              'Notificaciones',
              JSON.stringify(notificacionesTemportal)
            );
          }
          const notificacionesRedux = JSON.parse(
            localStorage.getItem('Notificaciones')
          );
          this.store.dispatch(
            setnotificaciones({ notificaciones: notificacionesRedux })
          );
        });
    } catch (err) {
      this.logeo.registrarLog('NOTIFICACIONES', 'CONSULTAR', JSON.stringify(err));
    }
  }

  newNotificacion = (newElemet) => {
    try {
      const tempNoticicaciones = JSON.parse(localStorage.getItem('Notificaciones'));
      tempNoticicaciones.push({
        ...newElemet,
        LEIDO: false,
      });
      localStorage.setItem('Notificaciones', JSON.stringify(tempNoticicaciones));
      const notificacionesRedux = JSON.parse(
        localStorage.getItem('Notificaciones')
      );
      this.store.dispatch(
        setnotificaciones({ notificaciones: notificacionesRedux })
      );
    } catch (err) {
      this.logeo.registrarLog('NOTIFICACIONES', 'AGREGAR', JSON.stringify(err));
    }
  }

  eliminarNoticiaciones = (ID_PROCESO: string) => {
    try {
      setTimeout(() => {
        const NotificacionesArrayLocal = JSON.parse(
          localStorage.getItem('Notificaciones')
        );
        const NuevoArrayNotificaciones = NotificacionesArrayLocal.map((e) => {
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
    } catch (err) {
      this.logeo.registrarLog('NOTIFICACIONES', 'ELIMINAR', JSON.stringify(err));
    }

  }
}
