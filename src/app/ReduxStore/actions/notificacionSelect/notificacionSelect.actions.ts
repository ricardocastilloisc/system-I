import { createAction, props } from "@ngrx/store";
import { NOTIFICACION_INTERFACE } from '../../../model/notificacion.model';

export const notificacionSelect = createAction(
  '[Notificacion] Notificacion Select',
  props<{notificacionSelect: NOTIFICACION_INTERFACE}>()
)
