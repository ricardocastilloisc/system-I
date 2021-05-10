import { createAction, props } from '@ngrx/store';
import { NOTIFICACION_INTERFACE } from 'src/app/model/notificacion.model';



export const setnotificaciones = createAction(
  '[notificaciones] Setnotificaciones',
  props<{notificaciones:NOTIFICACION_INTERFACE[]}>()
);

export const crearnotificacione = createAction('[notificaciones] Crearnotificaciones', props<{notificacion:NOTIFICACION_INTERFACE}>());
